import type { ReviewFinding, ReviewClause, RiskLevel } from '@/types';

/* ── Types ───────────────────────────────────────────────── */

export interface ContractAnalysisResult {
    riskScore: number;       // 0–100
    riskLevel: RiskLevel;
    summary: string;
    findings: ReviewFinding[];
    clauses: ReviewClause[];
}

/* ── OpenAI analysis ─────────────────────────────────────── */

const REVIEW_SYSTEM_PROMPT = `You are a senior contract review attorney AI. Analyze the provided contract text and return a comprehensive risk assessment.

RESPOND WITH VALID JSON ONLY. No markdown, no commentary. Use this exact structure:

{
  "riskScore": <number 0-100, where 0 = no risk, 100 = extreme risk>,
  "riskLevel": "<LOW | MEDIUM | HIGH | CRITICAL>",
  "summary": "<2-3 sentence executive summary of the contract and key risks>",
  "findings": [
    {
      "id": "<unique-id>",
      "title": "<short finding title>",
      "description": "<detailed explanation of the issue>",
      "severity": "<LOW | MEDIUM | HIGH | CRITICAL>",
      "clause": "<quote the relevant clause text>",
      "suggestion": "<actionable recommendation to mitigate the risk>"
    }
  ],
  "clauses": [
    {
      "id": "<unique-id>",
      "title": "<clause name, e.g. 'Confidentiality', 'Termination'>",
      "content": "<summarized clause content>",
      "riskLevel": "<LOW | MEDIUM | HIGH | CRITICAL>",
      "analysis": "<brief analysis of this clause>"
    }
  ]
}

ANALYSIS GUIDELINES:
- Identify missing standard clauses (indemnification, limitation of liability, dispute resolution, governing law)
- Flag one-sided or overly broad terms
- Check for ambiguous language
- Look for unusual or concerning provisions
- Assess enforceability concerns
- Identify potential compliance issues
- Include at least 3 findings and 4 clauses in your analysis
- Risk score guide: 0-25 LOW, 26-50 MEDIUM, 51-75 HIGH, 76-100 CRITICAL`;

export function buildReviewPrompt(contractText: string): { system: string; user: string } {
    return {
        system: REVIEW_SYSTEM_PROMPT,
        user: `Analyze the following contract:\n\n---\n${contractText}\n---`,
    };
}

export async function analyzeContractWithAI(contractText: string): Promise<ContractAnalysisResult> {
    const { system, user } = buildReviewPrompt(contractText);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user },
            ],
            temperature: 0.2,
            max_tokens: 4000,
            response_format: { type: 'json_object' },
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
        throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(content) as ContractAnalysisResult;

    // Validate range
    parsed.riskScore = Math.max(0, Math.min(100, parsed.riskScore));

    return parsed;
}

/* ── Fallback keyword-based analysis ─────────────────────── */

interface KeywordRule {
    pattern: RegExp;
    finding: Omit<ReviewFinding, 'id'>;
}

const RISK_KEYWORDS: KeywordRule[] = [
    {
        pattern: /unlimited liability|no limitation of liability/i,
        finding: {
            title: 'Unlimited Liability Exposure',
            description: 'The contract does not include a limitation of liability clause, exposing parties to unlimited financial risk.',
            severity: 'CRITICAL',
            clause: 'Limitation of Liability section is missing or insufficient.',
            suggestion: 'Add a mutual limitation of liability clause capping damages to the value of the contract or a defined amount.',
        },
    },
    {
        pattern: /indemnif/i,
        finding: {
            title: 'Indemnification Clause Present',
            description: 'An indemnification clause was detected. Review the scope to ensure it is mutual and reasonable.',
            severity: 'MEDIUM',
            clause: 'Indemnification clause found in the contract.',
            suggestion: 'Verify that indemnification obligations are mutual and include reasonable carve-outs for gross negligence and willful misconduct.',
        },
    },
    {
        pattern: /non-compete|non compete|noncompete/i,
        finding: {
            title: 'Non-Compete Restriction',
            description: 'A non-compete clause was found. This may limit business activities after the contract term ends.',
            severity: 'HIGH',
            clause: 'Non-compete restriction identified.',
            suggestion: 'Ensure the non-compete is limited in duration (ideally 12 months or less), geographic scope, and industry. Many jurisdictions restrict enforceability.',
        },
    },
    {
        pattern: /automatic renewal|auto-renew|automatically renew/i,
        finding: {
            title: 'Auto-Renewal Clause',
            description: 'The contract contains an automatic renewal provision that could lock parties into extended terms.',
            severity: 'MEDIUM',
            clause: 'Automatic renewal clause detected.',
            suggestion: 'Add a notice period for opting out of renewal (typically 30-90 days before renewal date) and ensure the renewal term is reasonable.',
        },
    },
    {
        pattern: /sole discretion|absolute discretion|unilateral/i,
        finding: {
            title: 'Unilateral Discretion',
            description: 'One party has sole or absolute discretion over certain matters, creating an imbalance of power.',
            severity: 'HIGH',
            clause: 'Sole/absolute discretion language found.',
            suggestion: 'Replace unilateral discretion with "reasonable discretion" or require mutual consent for material decisions.',
        },
    },
    {
        pattern: /waive|waiver of (rights|claims|jury)/i,
        finding: {
            title: 'Waiver of Rights',
            description: 'The contract includes clauses that waive certain legal rights.',
            severity: 'HIGH',
            clause: 'Rights waiver clause detected.',
            suggestion: 'Carefully review which rights are being waived and consider whether this is acceptable. Jury trial waivers and class action waivers should be evaluated with legal counsel.',
        },
    },
    {
        pattern: /terminate at any time|termination for convenience|without cause/i,
        finding: {
            title: 'Broad Termination Rights',
            description: 'One or both parties can terminate the contract at any time without cause, which may create uncertainty.',
            severity: 'MEDIUM',
            clause: 'Termination for convenience clause detected.',
            suggestion: 'Add a reasonable notice period (30-90 days) and address post-termination obligations including payment for work completed.',
        },
    },
    {
        pattern: /intellectual property|work.?for.?hire|ip assignment/i,
        finding: {
            title: 'Intellectual Property Assignment',
            description: 'IP ownership or assignment provisions detected. Ensure IP rights are clearly defined.',
            severity: 'MEDIUM',
            clause: 'Intellectual property clause found.',
            suggestion: 'Clarify ownership of pre-existing IP vs. newly created IP. Consider retaining a license for internal use if assigning all IP.',
        },
    },
    {
        pattern: /confidential|non-disclosure|nda/i,
        finding: {
            title: 'Confidentiality Obligations',
            description: 'The contract includes confidentiality provisions. Review the scope and duration.',
            severity: 'LOW',
            clause: 'Confidentiality clause present.',
            suggestion: 'Ensure confidentiality obligations have a reasonable duration (2-5 years), include standard exclusions, and define what constitutes confidential information.',
        },
    },
    {
        pattern: /governing law|jurisdiction|venue/i,
        finding: {
            title: 'Governing Law & Jurisdiction',
            description: 'The contract specifies governing law and jurisdiction for disputes.',
            severity: 'LOW',
            clause: 'Governing law clause present.',
            suggestion: 'Confirm the jurisdiction is favorable or at least neutral. Consider whether arbitration might be preferable to litigation.',
        },
    },
];

const MISSING_CLAUSE_CHECKS = [
    { keyword: /limitation of liability|limit.{1,20}liab/i, name: 'Limitation of Liability' },
    { keyword: /dispute resolution|arbitration|mediation/i, name: 'Dispute Resolution' },
    { keyword: /force majeure/i, name: 'Force Majeure' },
    { keyword: /governing law|jurisdiction/i, name: 'Governing Law' },
    { keyword: /termination|terminate/i, name: 'Termination' },
    { keyword: /confidentiali|non-disclosure/i, name: 'Confidentiality' },
];

export function analyzeContractFallback(contractText: string): ContractAnalysisResult {
    const findings: ReviewFinding[] = [];
    let findingIndex = 0;

    // Check for keyword-based risks
    for (const rule of RISK_KEYWORDS) {
        if (rule.pattern.test(contractText)) {
            findings.push({
                id: `finding-${++findingIndex}`,
                ...rule.finding,
            });
        }
    }

    // Check for missing standard clauses
    for (const check of MISSING_CLAUSE_CHECKS) {
        if (!check.keyword.test(contractText)) {
            findings.push({
                id: `finding-${++findingIndex}`,
                title: `Missing ${check.name} Clause`,
                description: `The contract does not appear to include a ${check.name} clause. This is a standard provision in most contracts.`,
                severity: check.name === 'Limitation of Liability' ? 'HIGH' : 'MEDIUM',
                clause: `No ${check.name} language found.`,
                suggestion: `Add a ${check.name} clause to protect both parties and clarify obligations.`,
            });
        }
    }

    // Build clause analysis from detected sections
    const clauses = extractClauses(contractText);

    // Calculate risk score based on findings
    const severityWeights: Record<RiskLevel, number> = { LOW: 5, MEDIUM: 15, HIGH: 25, CRITICAL: 40 };
    const rawScore = findings.reduce((sum, f) => sum + severityWeights[f.severity], 0);
    const riskScore = Math.min(100, Math.max(0, rawScore));

    const riskLevel: RiskLevel =
        riskScore >= 76 ? 'CRITICAL' :
            riskScore >= 51 ? 'HIGH' :
                riskScore >= 26 ? 'MEDIUM' : 'LOW';

    const critCount = findings.filter(f => f.severity === 'CRITICAL').length;
    const highCount = findings.filter(f => f.severity === 'HIGH').length;

    const summary = `This contract has been analyzed and received a risk score of ${riskScore}/100 (${riskLevel}). ${findings.length} findings were identified, including ${critCount} critical and ${highCount} high-severity issues. ${critCount > 0 ? 'Immediate attention is recommended for critical findings.' : 'Review the findings below for detailed analysis.'}`;

    return { riskScore, riskLevel, summary, findings, clauses };
}

function extractClauses(text: string): ReviewClause[] {
    const clausePatterns: { title: string; pattern: RegExp; }[] = [
        { title: 'Parties & Recitals', pattern: /(?:parties|between|recitals|whereas)/i },
        { title: 'Scope of Work / Services', pattern: /(?:scope|services|duties|obligations|responsibilities)/i },
        { title: 'Compensation & Payment', pattern: /(?:compensation|payment|salary|fee|price|amount)/i },
        { title: 'Term & Duration', pattern: /(?:term|duration|period|commence|effective date)/i },
        { title: 'Confidentiality', pattern: /(?:confidential|non-disclosure|proprietary)/i },
        { title: 'Termination', pattern: /(?:terminat|cancel|expire)/i },
        { title: 'Limitation of Liability', pattern: /(?:limitation|liability|damages|liable)/i },
        { title: 'Intellectual Property', pattern: /(?:intellectual property|copyright|patent|trademark|ip)/i },
        { title: 'Indemnification', pattern: /(?:indemnif|hold harmless)/i },
        { title: 'Governing Law', pattern: /(?:governing law|jurisdiction|venue|applicable law)/i },
    ];

    const clauses: ReviewClause[] = [];
    let clauseIndex = 0;

    for (const cp of clausePatterns) {
        const found = cp.pattern.test(text);
        if (found) {
            // Determine risk based on content heuristics
            let risk: RiskLevel = 'LOW';
            if (cp.title === 'Limitation of Liability' && /unlimited|no limit/i.test(text)) risk = 'CRITICAL';
            else if (cp.title === 'Termination' && /at any time|without cause/i.test(text)) risk = 'MEDIUM';
            else if (cp.title === 'Indemnification' && !/mutual/i.test(text)) risk = 'HIGH';

            clauses.push({
                id: `clause-${++clauseIndex}`,
                title: cp.title,
                content: `${cp.title} provisions are present in this contract.`,
                riskLevel: risk,
                analysis: `The ${cp.title} section was detected and analyzed. ${risk === 'LOW' ? 'No significant issues found.' : 'Further review recommended.'}`,
            });
        } else {
            clauses.push({
                id: `clause-${++clauseIndex}`,
                title: cp.title,
                content: `No ${cp.title} provisions were found.`,
                riskLevel: 'MEDIUM',
                analysis: `A ${cp.title} clause is typically expected but was not found in this contract. Consider adding one.`,
            });
        }
    }

    return clauses;
}
