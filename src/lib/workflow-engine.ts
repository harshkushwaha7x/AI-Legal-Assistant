/**
 * Workflow engine for multi-step legal review processes
 * Manages state transitions, step validation, and progress tracking
 */

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';

export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    status: StepStatus;
    required: boolean;
    order: number;
    completedAt?: string;
    assignee?: string;
    notes?: string;
}

export interface Workflow {
    id: string;
    name: string;
    steps: WorkflowStep[];
    createdAt: string;
    updatedAt: string;
    currentStepIndex: number;
}

/**
 * Create a new workflow from step definitions
 */
export function createWorkflow(
    id: string,
    name: string,
    stepDefs: Omit<WorkflowStep, 'status' | 'completedAt'>[]
): Workflow {
    return {
        id,
        name,
        steps: stepDefs.map((s) => ({ ...s, status: 'pending' as StepStatus })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStepIndex: 0,
    };
}

/**
 * Advance a step to the next status
 */
export function completeStep(workflow: Workflow, stepId: string, notes?: string): Workflow {
    const updated = { ...workflow, steps: [...workflow.steps] };
    const stepIdx = updated.steps.findIndex((s) => s.id === stepId);
    if (stepIdx === -1) return workflow;

    updated.steps[stepIdx] = {
        ...updated.steps[stepIdx],
        status: 'completed',
        completedAt: new Date().toISOString(),
        notes: notes || updated.steps[stepIdx].notes,
    };

    // Advance current step pointer
    const nextPending = updated.steps.findIndex(
        (s, i) => i > stepIdx && s.status === 'pending'
    );
    if (nextPending !== -1) {
        updated.currentStepIndex = nextPending;
    }

    updated.updatedAt = new Date().toISOString();
    return updated;
}

/**
 * Skip an optional step
 */
export function skipStep(workflow: Workflow, stepId: string): Workflow {
    const step = workflow.steps.find((s) => s.id === stepId);
    if (!step || step.required) return workflow;

    const updated = { ...workflow, steps: [...workflow.steps] };
    const idx = updated.steps.findIndex((s) => s.id === stepId);
    updated.steps[idx] = { ...updated.steps[idx], status: 'skipped' };
    updated.updatedAt = new Date().toISOString();
    return updated;
}

/**
 * Fail a step with a reason
 */
export function failStep(workflow: Workflow, stepId: string, reason: string): Workflow {
    const updated = { ...workflow, steps: [...workflow.steps] };
    const idx = updated.steps.findIndex((s) => s.id === stepId);
    if (idx === -1) return workflow;

    updated.steps[idx] = { ...updated.steps[idx], status: 'failed', notes: reason };
    updated.updatedAt = new Date().toISOString();
    return updated;
}

/**
 * Calculate workflow progress (0-100)
 */
export function getWorkflowProgress(workflow: Workflow): number {
    const total = workflow.steps.length;
    if (total === 0) return 100;

    const done = workflow.steps.filter(
        (s) => s.status === 'completed' || s.status === 'skipped'
    ).length;

    return Math.round((done / total) * 100);
}

/**
 * Check if all required steps are completed
 */
export function isWorkflowComplete(workflow: Workflow): boolean {
    return workflow.steps
        .filter((s) => s.required)
        .every((s) => s.status === 'completed');
}

/**
 * Get the current active step
 */
export function getCurrentStep(workflow: Workflow): WorkflowStep | null {
    return workflow.steps[workflow.currentStepIndex] || null;
}

/**
 * Pre-built contract review workflow
 */
export const CONTRACT_REVIEW_STEPS: Omit<WorkflowStep, 'status' | 'completedAt'>[] = [
    { id: 'upload', name: 'Upload Document', description: 'Upload the contract for review', required: true, order: 0 },
    { id: 'ai-analysis', name: 'AI Analysis', description: 'Automated AI risk assessment', required: true, order: 1 },
    { id: 'legal-review', name: 'Legal Review', description: 'Attorney reviews flagged clauses', required: true, order: 2 },
    { id: 'client-feedback', name: 'Client Feedback', description: 'Client reviews and provides feedback', required: false, order: 3 },
    { id: 'revisions', name: 'Revisions', description: 'Apply requested revisions', required: false, order: 4 },
    { id: 'final-approval', name: 'Final Approval', description: 'Final sign-off from authorized party', required: true, order: 5 },
];
