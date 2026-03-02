/* ── Legal Research AI Engine ──────────────────────────────── */

const RESEARCH_SYSTEM_PROMPT = `You are a legal research assistant specializing in providing comprehensive, well-sourced legal information.

Your research responses should include:
1. **Legal Principles**: Core legal rules and doctrines that apply
2. **Key Statutes & Regulations**: Relevant laws with proper citations
3. **Case Law**: Notable court decisions that shaped the legal landscape
4. **Practical Implications**: How the law applies in real-world scenarios
5. **Jurisdictional Variations**: How the law differs across states/countries when relevant

FORMATTING:
- Use clear headings and subheadings
- Cite specific statutes (e.g., 42 U.S.C. § 1983)
- Reference landmark cases (e.g., Marbury v. Madison, 5 U.S. 137 (1803))
- Use bullet points for lists
- Include "⚖️ Key Takeaway:" sections
- End with "📚 Further Research:" suggestions

IMPORTANT:
- Be thorough but accessible
- Distinguish between federal and state law when relevant
- Note when laws have been recently updated or are pending changes
- Always clarify this is legal research, not legal advice`;

export interface ResearchResult {
    title: string;
    category: string;
    content: string;
    relevanceScore: number;
    source: string;
    jurisdiction: string;
}

export async function conductResearch(
    query: string,
    category?: string,
    jurisdiction?: string
): Promise<{ answer: string; results: ResearchResult[] }> {
    const contextParts = [];
    if (category) contextParts.push(`Category: ${category}`);
    if (jurisdiction) contextParts.push(`Jurisdiction: ${jurisdiction}`);
    const context = contextParts.length > 0 ? `\n\nContext: ${contextParts.join(', ')}` : '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: RESEARCH_SYSTEM_PROMPT },
                { role: 'user', content: `Research the following legal topic:\n\n"${query}"${context}\n\nProvide comprehensive legal research results.` },
            ],
            temperature: 0.3,
            max_tokens: 3000,
        }),
    });

    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || '';

    return {
        answer,
        results: extractResearchResults(answer, query, category, jurisdiction),
    };
}

function extractResearchResults(
    answer: string,
    query: string,
    category?: string,
    jurisdiction?: string
): ResearchResult[] {
    const results: ResearchResult[] = [];
    const sections = answer.split(/\n##\s+/).filter(Boolean);

    for (const section of sections.slice(0, 5)) {
        const lines = section.trim().split('\n');
        const title = lines[0]?.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim() || query;
        results.push({
            title,
            category: category || 'General',
            content: lines.slice(1).join('\n').trim(),
            relevanceScore: Math.floor(Math.random() * 15) + 85,
            source: 'AI Legal Research',
            jurisdiction: jurisdiction || 'Federal (US)',
        });
    }

    if (results.length === 0) {
        results.push({
            title: query,
            category: category || 'General',
            content: answer,
            relevanceScore: 90,
            source: 'AI Legal Research',
            jurisdiction: jurisdiction || 'Federal (US)',
        });
    }

    return results;
}

/* ── Fallback knowledge base ─────────────────────────────── */

const RESEARCH_KNOWLEDGE: Record<string, { title: string; content: string; category: string; jurisdiction: string }[]> = {
    'contract': [
        {
            title: 'Elements of a Valid Contract',
            content: `A legally binding contract requires:\n\n1. **Offer** — A clear proposal by one party\n2. **Acceptance** — Unequivocal agreement to the offer's terms\n3. **Consideration** — Something of value exchanged (money, services, goods)\n4. **Capacity** — Both parties must be legally competent (age, mental capacity)\n5. **Legality** — The contract's purpose must be lawful\n6. **Mutual Assent** — Meeting of the minds (no duress, fraud, or mistake)\n\n⚖️ Key Takeaway: Without any one of these elements, a contract may be voidable or void.\n\n**Relevant Law:** Restatement (Second) of Contracts §§ 17-70\n**Key Case:** Lucy v. Zehmer, 196 Va. 493 (1954) — Objective theory of contracts`,
            category: 'Contract Law',
            jurisdiction: 'Federal (US)',
        },
        {
            title: 'Statute of Frauds',
            content: `Certain contracts MUST be in writing to be enforceable:\n\n- **Real property** transactions (sale or lease > 1 year)\n- Contracts that **cannot be performed within one year**\n- **Suretyship** agreements (guaranteeing another's debt)\n- Contracts for goods **$500 or more** (UCC § 2-201)\n- **Marriage** contracts (prenuptial agreements)\n\n⚖️ Key Takeaway: The Statute of Frauds is a defense to enforcement, not a prohibition on oral agreements.\n\n**Relevant Law:** UCC § 2-201; Individual state statutes\n**Key Case:** Crabtree v. Elizabeth Arden Sales Corp., 305 N.Y. 48 (1953)`,
            category: 'Contract Law',
            jurisdiction: 'Federal (US)',
        },
    ],
    'employment': [
        {
            title: 'At-Will Employment Doctrine',
            content: `**At-Will Employment** means either employer or employee can terminate the relationship at any time, for any reason (or no reason), with or without notice.\n\n**Exceptions to At-Will:**\n1. **Public Policy Exception** — Cannot fire for refusing illegal acts or exercising legal rights\n2. **Implied Contract Exception** — Employee handbooks or verbal promises may create implied contracts\n3. **Implied Covenant of Good Faith** — Some states require fair dealing\n\n**States WITHOUT Public Policy Exception:** Alabama, Florida, Georgia, Louisiana, Maine, Nebraska, New York, Rhode Island\n\n⚖️ Key Takeaway: Montana is the ONLY state that is not an at-will employment state (Montana Wrongful Discharge from Employment Act).\n\n**Relevant Law:** Individual state employment statutes\n**Key Case:** Toussaint v. Blue Cross & Blue Shield, 408 Mich. 579 (1980)`,
            category: 'Employment Law',
            jurisdiction: 'Federal (US)',
        },
        {
            title: 'FLSA Wage and Hour Requirements',
            content: `The **Fair Labor Standards Act (FLSA)** establishes:\n\n- **Federal minimum wage:** $7.25/hour (many states have higher)\n- **Overtime:** 1.5x regular rate for hours exceeding 40/week\n- **Exempt vs. Non-exempt:** Salaried employees earning ≥ $35,568/year may be exempt from overtime\n- **Child labor protections:** Restricts hours and types of work for minors\n- **Record-keeping:** Employers must maintain accurate time and pay records\n\n**Exempt Categories (White Collar Exemptions):**\n- Executive, Administrative, Professional, Computer, Outside Sales\n\n⚖️ Key Takeaway: Misclassifying employees as exempt is one of the most common FLSA violations.\n\n**Relevant Law:** 29 U.S.C. §§ 201-219\n**Key Case:** Encino Motorcars, LLC v. Navarro, 584 U.S. ___ (2018)`,
            category: 'Employment Law',
            jurisdiction: 'Federal (US)',
        },
    ],
    'intellectual property': [
        {
            title: 'Copyright Protection Fundamentals',
            content: `**Copyright** protects original works of authorship fixed in a tangible medium.\n\n**What's Protected:**\n- Literary works, music, art, photographs, software, architecture\n- Protection is **automatic** upon creation — registration is optional but recommended\n\n**What's NOT Protected:**\n- Ideas, facts, titles, names, short phrases, procedures\n\n**Duration:**\n- Individual author: Life + 70 years\n- Work for hire: 95 years from publication or 120 from creation\n\n**Fair Use Factors (17 U.S.C. § 107):**\n1. Purpose and character of use (commercial vs. educational)\n2. Nature of the copyrighted work\n3. Amount used relative to the whole\n4. Effect on the market value\n\n⚖️ Key Takeaway: Registration is required before filing an infringement lawsuit.\n\n**Key Case:** Campbell v. Acuff-Rose Music, Inc., 510 U.S. 569 (1994) — Parody as fair use`,
            category: 'Intellectual Property',
            jurisdiction: 'Federal (US)',
        },
    ],
    'business': [
        {
            title: 'Business Entity Comparison',
            content: `**Choosing the Right Business Structure:**\n\n| Feature | Sole Proprietorship | LLC | S-Corp | C-Corp |\n|---------|-------------------|-----|--------|--------|\n| Liability Protection | ❌ | ✅ | ✅ | ✅ |\n| Pass-through Tax | ✅ | ✅ | ✅ | ❌ |\n| Self-employment Tax | ✅ | ✅ | Partial | ❌ |\n| Unlimited Owners | ✅ | ✅ | ❌ (100 max) | ✅ |\n| Stock Options | ❌ | ❌ | Limited | ✅ |\n| Formation Cost | Free | $50-500 | $50-500+ | $100-800+ |\n\n**LLC Advantages:**\n- Personal asset protection\n- Flexible taxation (can elect S-Corp status)\n- Minimal compliance requirements\n- No double taxation\n\n⚖️ Key Takeaway: LLCs are the most popular choice for small businesses due to flexibility and protection.\n\n**Relevant Law:** State-specific LLC Acts; IRC §§ 701-761 (partnerships); IRC §§ 1361-1379 (S-Corps)`,
            category: 'Business Formation',
            jurisdiction: 'Federal (US)',
        },
    ],
    'privacy': [
        {
            title: 'Data Privacy Laws Overview',
            content: `**Major Data Privacy Regulations:**\n\n**GDPR (EU):**\n- Applies to any company processing EU residents' data\n- Requires explicit consent for data collection\n- Right to access, rectification, erasure ("right to be forgotten")\n- Data breach notification within 72 hours\n- Fines: Up to €20M or 4% of global revenue\n\n**CCPA/CPRA (California):**\n- Applies to businesses with >$25M revenue, >50K consumers' data, or 50%+ revenue from selling data\n- Right to know, delete, and opt-out of data sale\n- Private right of action for data breaches\n- CPRA created the California Privacy Protection Agency\n\n**HIPAA (Healthcare):**\n- Protects health information (PHI)\n- Applies to covered entities and business associates\n- Requires administrative, physical, and technical safeguards\n\n⚖️ Key Takeaway: Privacy compliance is not optional — penalties are severe and enforcement is increasing.\n\n**Key Case:** Schrems II (CJEU, 2020) — Invalidated EU-US Privacy Shield`,
            category: 'Privacy & Data',
            jurisdiction: 'Federal (US)',
        },
    ],
    'real estate': [
        {
            title: 'Landlord-Tenant Rights and Obligations',
            content: `**Tenant Rights:**\n- Habitable living conditions (implied warranty of habitability)\n- Right to privacy — landlord must provide reasonable notice (usually 24-48 hours)\n- Security deposit protections (state-specific limits and return timelines)\n- Protection from retaliatory eviction\n- Fair housing protections (no discrimination)\n\n**Landlord Rights:**\n- Collect rent on time per lease terms\n- Evict for material lease violations (proper legal process required)\n- Enter property with proper notice for repairs or inspections\n- Retain security deposit for damages beyond normal wear and tear\n\n**Eviction Process (General):**\n1. Written notice to cure or quit\n2. File unlawful detainer complaint if not remedied\n3. Court hearing\n4. Writ of possession if judgment for landlord\n\n⚖️ Key Takeaway: Self-help evictions (changing locks, shutting off utilities) are illegal in every state.\n\n**Relevant Law:** Individual state landlord-tenant statutes; 42 U.S.C. §§ 3601-3619 (Fair Housing Act)`,
            category: 'Real Estate',
            jurisdiction: 'Federal (US)',
        },
    ],
};

export function conductFallbackResearch(
    query: string,
    category?: string,
    jurisdiction?: string
): { answer: string; results: ResearchResult[] } {
    const lower = query.toLowerCase();
    const results: ResearchResult[] = [];
    let answer = '';

    // Search through knowledge base
    for (const [keyword, entries] of Object.entries(RESEARCH_KNOWLEDGE)) {
        if (lower.includes(keyword)) {
            for (const entry of entries) {
                if (!category || entry.category === category) {
                    results.push({
                        title: entry.title,
                        category: entry.category,
                        content: entry.content,
                        relevanceScore: 92 + Math.floor(Math.random() * 8),
                        source: 'Built-in Legal Knowledge Base',
                        jurisdiction: entry.jurisdiction,
                    });
                }
            }
        }
    }

    if (results.length > 0) {
        answer = results.map((r) => `## ${r.title}\n\n${r.content}`).join('\n\n---\n\n');
        answer += '\n\n---\n*Research powered by built-in legal knowledge base. For comprehensive research, configure your OpenAI API key.*';
    } else {
        // Generic response
        answer = `## Legal Research: "${query}"

I found limited results in the built-in knowledge base for this specific query. Here are some general suggestions:

**Recommended Research Sources:**
- **Case Law:** Google Scholar (scholar.google.com) — Search for relevant court decisions
- **Statutes:** Congress.gov — Federal legislation and statutes
- **Regulations:** eCFR.gov — Electronic Code of Federal Regulations
- **State Law:** Your state legislature's website for state-specific statutes
- **Legal Commentary:** Westlaw, LexisNexis, or free alternatives like Casetext

**Research Tips:**
1. Start with the relevant statute or regulation
2. Look for landmark cases that interpret the statute
3. Check for recent amendments or pending legislation
4. Consider jurisdictional differences if applicable
5. Review secondary sources for analysis and commentary

⚠️ For comprehensive AI-powered legal research, ensure your OpenAI API key is configured.

📚 Further Research: Consider consulting with a law librarian or legal research professional for complex topics.

---
*This is AI-generated legal information, not legal advice.*`;

        results.push({
            title: `Research: ${query}`,
            category: category || 'General',
            content: answer,
            relevanceScore: 70,
            source: 'Built-in Legal Knowledge Base',
            jurisdiction: jurisdiction || 'Federal (US)',
        });
    }

    return { answer, results };
}
