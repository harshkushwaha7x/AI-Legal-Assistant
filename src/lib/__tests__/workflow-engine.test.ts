import {
    createWorkflow,
    completeStep,
    skipStep,
    failStep,
    getWorkflowProgress,
    isWorkflowComplete,
    getCurrentStep,
    CONTRACT_REVIEW_STEPS,
} from '@/lib/workflow-engine';

describe('Workflow Engine', () => {
    const makeWorkflow = () => createWorkflow('w1', 'Test Workflow', CONTRACT_REVIEW_STEPS);

    describe('createWorkflow', () => {
        it('creates a workflow with all steps pending', () => {
            const wf = makeWorkflow();
            expect(wf.id).toBe('w1');
            expect(wf.name).toBe('Test Workflow');
            expect(wf.steps.length).toBe(CONTRACT_REVIEW_STEPS.length);
            wf.steps.forEach((s) => expect(s.status).toBe('pending'));
        });

        it('starts at step 0', () => {
            expect(makeWorkflow().currentStepIndex).toBe(0);
        });
    });

    describe('completeStep', () => {
        it('marks step as completed', () => {
            const wf = makeWorkflow();
            const updated = completeStep(wf, 'upload');
            const step = updated.steps.find((s) => s.id === 'upload');
            expect(step?.status).toBe('completed');
            expect(step?.completedAt).toBeTruthy();
        });

        it('advances current step index', () => {
            const wf = makeWorkflow();
            const updated = completeStep(wf, 'upload');
            expect(updated.currentStepIndex).toBe(1);
        });

        it('adds notes', () => {
            const wf = makeWorkflow();
            const updated = completeStep(wf, 'upload', 'Uploaded PDF successfully');
            expect(updated.steps[0].notes).toBe('Uploaded PDF successfully');
        });

        it('ignores unknown step ID', () => {
            const wf = makeWorkflow();
            const updated = completeStep(wf, 'nonexistent');
            expect(updated).toEqual(wf);
        });
    });

    describe('skipStep', () => {
        it('skips an optional step', () => {
            const wf = makeWorkflow();
            const updated = skipStep(wf, 'client-feedback');
            const step = updated.steps.find((s) => s.id === 'client-feedback');
            expect(step?.status).toBe('skipped');
        });

        it('does not skip a required step', () => {
            const wf = makeWorkflow();
            const updated = skipStep(wf, 'upload');
            const step = updated.steps.find((s) => s.id === 'upload');
            expect(step?.status).toBe('pending');
        });
    });

    describe('failStep', () => {
        it('marks step as failed with reason', () => {
            const wf = makeWorkflow();
            const updated = failStep(wf, 'ai-analysis', 'Timeout');
            const step = updated.steps.find((s) => s.id === 'ai-analysis');
            expect(step?.status).toBe('failed');
            expect(step?.notes).toBe('Timeout');
        });
    });

    describe('getWorkflowProgress', () => {
        it('returns 0 for no completed steps', () => {
            expect(getWorkflowProgress(makeWorkflow())).toBe(0);
        });

        it('increases as steps complete', () => {
            let wf = makeWorkflow();
            wf = completeStep(wf, 'upload');
            const progress = getWorkflowProgress(wf);
            expect(progress).toBeGreaterThan(0);
            expect(progress).toBeLessThan(100);
        });

        it('counts skipped as done', () => {
            let wf = makeWorkflow();
            wf = skipStep(wf, 'client-feedback');
            expect(getWorkflowProgress(wf)).toBeGreaterThan(0);
        });
    });

    describe('isWorkflowComplete', () => {
        it('returns false when required steps pending', () => {
            expect(isWorkflowComplete(makeWorkflow())).toBe(false);
        });

        it('returns true when all required steps completed', () => {
            let wf = makeWorkflow();
            const requiredIds = wf.steps.filter((s) => s.required).map((s) => s.id);
            for (const id of requiredIds) {
                wf = completeStep(wf, id);
            }
            expect(isWorkflowComplete(wf)).toBe(true);
        });
    });

    describe('getCurrentStep', () => {
        it('returns first step initially', () => {
            const step = getCurrentStep(makeWorkflow());
            expect(step?.id).toBe('upload');
        });

        it('advances after completing', () => {
            let wf = makeWorkflow();
            wf = completeStep(wf, 'upload');
            expect(getCurrentStep(wf)?.id).toBe('ai-analysis');
        });
    });
});
