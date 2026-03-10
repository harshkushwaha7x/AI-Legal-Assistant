/* ── Legal AI Chat Engine ────────────────────────────────── */

const LEGAL_CHAT_SYSTEM_PROMPT = `You are LegalAI, an expert AI legal assistant. You provide helpful, accurate legal information in plain English.

IMPORTANT GUIDELINES:
- Provide clear, practical legal guidance without unnecessary jargon
- Always clarify that you provide legal INFORMATION, not legal ADVICE
- Recommend consulting a licensed attorney for specific legal matters
- Be thorough but concise — use bullet points and structured responses
- If you don't know something, say so honestly
- Reference relevant laws, statutes, or legal principles when applicable
- Consider jurisdiction-specific differences when relevant
- Flag potential risks or important deadlines the user should be aware of
- Ask clarifying questions when the user's situation is ambiguous

EXPERTISE AREAS:
- Contract law and interpretation
- Employment law (hiring, termination, discrimination, wages)
- Business formation (LLC, Corporation, Partnership)
- Intellectual property (trademarks, copyrights, patents)
- Real estate law (leases, purchase agreements, landlord-tenant)
- Family law basics (divorce, custody, prenuptials)
- Consumer protection
- Privacy and data protection (GDPR, CCPA)
- Small claims and dispute resolution

RESPONSE FORMAT:
- Use clear headings for different topics
- Use bullet points for lists
- Highlight important warnings with "Important:"
- End complex answers with "Next Steps:" when applicable
- Keep responses focused and actionable

DISCLAIMER: Always include a brief note that this is AI-generated legal information, not legal advice, for complex or high-stakes queries.`;

export interface ChatCompletionMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export function buildChatMessages(
    history: { role: string; content: string }[],
    userMessage: string
): ChatCompletionMessage[] {
    const messages: ChatCompletionMessage[] = [
        { role: 'system', content: LEGAL_CHAT_SYSTEM_PROMPT },
    ];

    // Include last 20 messages for context
    const recentHistory = history.slice(-20);
    for (const msg of recentHistory) {
        messages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        });
    }

    messages.push({ role: 'user', content: userMessage });

    return messages;
}

export async function getChatCompletion(
    messages: ChatCompletionMessage[]
): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.4,
            max_tokens: 2000,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, I was unable to generate a response. Please try again.';
}

/* ── Fallback responses (no API key) ─────────────────────── */

const LEGAL_KNOWLEDGE_BASE: Record<string, string> = {
    nda: `**Non-Disclosure Agreements (NDAs)**

An NDA is a legally binding contract that establishes a confidential relationship between parties.

**Key Components:**
- **Parties**: Who is bound by the agreement
- **Definition of Confidential Information**: What information is protected
- **Scope of Obligations**: What the receiving party must/must not do
- **Time Period**: How long the obligations last
- **Exclusions**: Information that isn't considered confidential

**Types:**
- **Unilateral NDA**: One party discloses, the other receives
- **Mutual NDA**: Both parties share and receive information
- **Multilateral NDA**: Three or more parties involved

Important: NDAs must be reasonable in scope and duration to be enforceable.

Next Steps: Consider what information needs protection, the relationship between parties, and the appropriate duration.`,

    contract: `**Contract Law Basics**

A valid contract requires these essential elements:
- **Offer**: One party proposes terms
- **Acceptance**: The other party agrees to those terms
- **Consideration**: Something of value exchanged by both parties
- **Capacity**: Both parties must be legally able to enter a contract
- **Legality**: The contract's purpose must be legal

**Common Contract Issues:**
- Breach of contract (material vs. minor)
- Unconscionable terms
- Misrepresentation or fraud
- Impossibility of performance
- Statute of limitations for claims

Important: Always read contracts carefully before signing. Verbal contracts can be enforceable but are harder to prove.`,

    employment: `**Employment Law Overview**

**Key Areas:**
- **At-Will Employment**: Most US states follow this doctrine — either party can end employment at any time
- **Wrongful Termination**: Firing based on protected characteristics, retaliation, or contract violation
- **Wage & Hour Laws**: Minimum wage, overtime (FLSA), meal/rest breaks
- **Discrimination**: Protected under Title VII, ADA, ADEA, and state laws
- **Workplace Safety**: OSHA requirements

**Employee Rights:**
- Freedom from discrimination and harassment
- Safe working conditions
- Fair compensation for work performed
- Family and medical leave (FMLA for eligible employees)
- Workers' compensation for on-the-job injuries

Important: Employment laws vary significantly by state. Always check your local regulations.`,

    llc: `**LLC Formation Guide**

A Limited Liability Company (LLC) provides personal liability protection with tax flexibility.

**Steps to Form an LLC:**
1. Choose a business name (check availability)
2. File Articles of Organization with your state
3. Create an Operating Agreement
4. Obtain an EIN from the IRS
5. Register for state/local taxes
6. Obtain necessary licenses and permits

**Advantages:**
- Personal asset protection
- Pass-through taxation (avoid double taxation)
- Flexible management structure
- Less paperwork than corporations

**Costs:** Filing fees range from $50-$500 depending on state.

Next Steps: Research your state's specific requirements and consider consulting with a business attorney.`,

    lease: `**Lease Agreement Essentials**

**Tenant Rights:**
- Habitable living conditions
- Privacy (landlord must give notice before entering)
- Security deposit return (minus legitimate deductions)
- Protection against illegal discrimination
- Right to withhold rent in some states for serious habitability issues

**Landlord Rights:**
- Collect rent on time
- Evict for lease violations (following proper legal process)
- Enter property with proper notice
- Retain security deposit for damages beyond normal wear

**Common Issues:**
- Security deposit disputes
- Maintenance and repair responsibilities
- Early termination penalties
- Subletting restrictions
- Lease renewal terms

Important: Landlord-tenant laws are very state-specific. Know your local regulations.`,

    ip: `**Intellectual Property Overview**

**Types of IP Protection:**

1. **Trademarks** — Protect brand names, logos, slogans
   - Register with USPTO
   - Use ™ (unregistered) or ® (registered)
   - Must be actively used in commerce

2. **Copyrights** — Protect original creative works
   - Automatic upon creation
   - Registration provides additional legal benefits
   - Lasts life of author + 70 years

3. **Patents** — Protect inventions and processes
   - Utility, design, or plant patents
   - Must be novel, non-obvious, and useful
   - 20-year protection from filing date

4. **Trade Secrets** — Protect confidential business information
   - No registration required
   - Must take reasonable steps to maintain secrecy
   - Protected indefinitely if kept secret

Next Steps: Identify which type of IP protection you need and consider filing appropriate applications.`,
};

export function generateFallbackResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();

    // Check knowledge base
    for (const [keyword, response] of Object.entries(LEGAL_KNOWLEDGE_BASE)) {
        if (lower.includes(keyword)) {
            return response + '\n\n---\n*This is AI-generated legal information, not legal advice. Consult a licensed attorney for your specific situation.*';
        }
    }

    // Topic-specific responses
    if (lower.includes('divorce') || lower.includes('custody') || lower.includes('family')) {
        return `**Family Law Guidance**

Family law matters are highly personal and jurisdiction-specific. Here are some general principles:

**Divorce:**
- Grounds can be fault-based or no-fault depending on your state
- Property division follows either community property or equitable distribution rules
- Alimony/spousal support depends on length of marriage, income disparity, and other factors

**Child Custody:**
- Courts prioritize the "best interest of the child"
- Types: sole custody, joint custody, physical vs. legal custody
- Custody can be modified if circumstances change significantly

Important: Family law matters almost always benefit from professional legal representation.

---
*This is AI-generated legal information, not legal advice. Please consult a family law attorney for your specific situation.*`;
    }

    if (lower.includes('sue') || lower.includes('lawsuit') || lower.includes('court') || lower.includes('claim')) {
        return `**Filing a Legal Claim**

Before filing a lawsuit, consider these steps:

1. **Document Everything**: Keep records of all relevant communications and evidence
2. **Check Statute of Limitations**: Claims must be filed within specific time limits
3. **Consider Alternatives**: Mediation or arbitration may be faster and less expensive
4. **Evaluate Costs vs. Benefits**: Litigation can be expensive and time-consuming
5. **Small Claims Court**: For disputes under a certain dollar amount (varies by state, typically $5,000-$10,000)

**General Timeline:**
- File complaint → Defendant responds → Discovery → Potential settlement → Trial

Important: Statutes of limitations vary by claim type and state. Don't delay seeking legal help.

---
*This is AI-generated legal information, not legal advice. Please consult an attorney for your specific situation.*`;
    }

    // Default response
    return `Thank you for your legal question. I can help with a wide range of legal topics including:

- **Contract Law** — NDAs, service agreements, employment contracts
- **Business Law** — LLC formation, partnerships, corporate structure
- **Employment Law** — workplace rights, termination, discrimination
- **Real Estate** — leases, purchase agreements, landlord-tenant issues
- **Intellectual Property** — trademarks, copyrights, patents
- **Family Law** — divorce, custody, prenuptial agreements
- **Consumer Protection** — warranty rights, dispute resolution

Could you provide more details about your specific legal question? The more context you give me, the more helpful I can be.

**Tips for getting the best answers:**
- Describe your specific situation
- Mention your state/jurisdiction if relevant
- Let me know if you're asking about business or personal matters

---
*I provide legal information, not legal advice. For specific legal matters, please consult a licensed attorney.*`;
}

/* ── Auto-generate session title from first message ──────── */

export function generateSessionTitle(message: string): string {
    // Take first 60 chars, clean up
    const cleaned = message
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (cleaned.length <= 50) return cleaned;
    return cleaned.slice(0, 47) + '...';
}
