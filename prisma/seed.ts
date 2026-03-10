import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const KNOWLEDGE_DATA = [
    {
        title: 'Elements of a Valid Contract',
        category: 'Contract Law',
        content: `A legally binding contract requires six essential elements:\n\n1. **Offer** — A clear proposal by one party to another\n2. **Acceptance** — Unequivocal agreement to the terms of the offer\n3. **Consideration** — Something of value exchanged between parties\n4. **Capacity** — Both parties must be legally competent\n5. **Legality** — The contract's purpose must be lawful\n6. **Mutual Assent** — A genuine meeting of the minds\n\nRelevant Law: Restatement (Second) of Contracts §§ 17-70\nKey Case: Lucy v. Zehmer, 196 Va. 493 (1954)`,
        source: 'Restatement (Second) of Contracts',
        jurisdiction: 'Federal (US)',
    },
    {
        title: 'Statute of Frauds Requirements',
        category: 'Contract Law',
        content: `Certain contracts must be in writing to be enforceable:\n\n- Real property transactions (sale or lease > 1 year)\n- Contracts not performable within one year\n- Suretyship agreements\n- Goods valued at $500 or more (UCC § 2-201)\n- Marriage contracts (prenuptial agreements)\n\nRelevant Law: UCC § 2-201; State-specific statutes\nKey Case: Crabtree v. Elizabeth Arden Sales Corp., 305 N.Y. 48 (1953)`,
        source: 'Uniform Commercial Code',
        jurisdiction: 'Federal (US)',
    },
    {
        title: 'At-Will Employment Doctrine',
        category: 'Employment Law',
        content: `At-will employment allows either party to terminate the relationship at any time, for any legal reason.\n\nExceptions:\n1. **Public Policy** — Cannot fire for refusing illegal acts\n2. **Implied Contract** — Handbooks may create binding obligations\n3. **Good Faith & Fair Dealing** — Some states require fair dealing\n\nMontana is the only non-at-will state.\n\nKey Case: Toussaint v. Blue Cross, 408 Mich. 579 (1980)`,
        source: 'State Employment Statutes',
        jurisdiction: 'Federal (US)',
    },
    {
        title: 'FLSA Wage and Hour Requirements',
        category: 'Employment Law',
        content: `The Fair Labor Standards Act establishes:\n\n- Federal minimum wage: $7.25/hour\n- Overtime: 1.5x for hours exceeding 40/week\n- Exempt employees must earn ≥ $35,568/year\n- White collar exemptions: Executive, Administrative, Professional\n\nRelevant Law: 29 U.S.C. §§ 201-219\nKey Case: Encino Motorcars v. Navarro, 584 U.S. (2018)`,
        source: 'Fair Labor Standards Act',
        jurisdiction: 'Federal (US)',
    },
    {
        title: 'Copyright Protection Basics',
        category: 'Intellectual Property',
        content: `Copyright protects original works fixed in tangible medium.\n\nProtected: Literary works, music, software, architecture\nNot Protected: Ideas, facts, short phrases, procedures\n\nDuration: Life + 70 years (individual) or 95/120 years (work-for-hire)\n\nFair Use Factors (17 U.S.C. § 107):\n1. Purpose of use\n2. Nature of the work\n3. Amount used\n4. Market impact\n\nKey Case: Campbell v. Acuff-Rose, 510 U.S. 569 (1994)`,
        source: '17 U.S.C. § 101 et seq.',
        jurisdiction: 'Federal (US)',
    },
    {
        title: 'Business Entity Comparison',
        category: 'Business Formation',
        content: `Sole Proprietorship: No liability protection, simple setup\nLLC: Personal asset protection, flexible taxation, minimal compliance\nS-Corp: Pass-through tax, limited to 100 shareholders\nC-Corp: Unlimited shareholders, stock options, double taxation\n\nLLCs are most popular for small businesses due to flexibility.\n\nRelevant Law: State LLC Acts; IRC §§ 701-761`,
        source: 'Internal Revenue Code',
        jurisdiction: 'Federal (US)',
    },
    {
        title: 'GDPR Compliance Requirements',
        category: 'Privacy & Data',
        content: `GDPR applies to companies processing EU residents' data:\n\n- Explicit consent required\n- Right to access, rectification, and erasure\n- Data breach notification within 72 hours\n- Data Protection Officer required in some cases\n- Fines up to €20M or 4% of global revenue\n\nKey Case: Schrems II (CJEU, 2020)`,
        source: 'EU General Data Protection Regulation',
        jurisdiction: 'European Union',
    },
    {
        title: 'Landlord-Tenant Rights Overview',
        category: 'Real Estate',
        content: `Tenant rights include habitability, privacy (24-48hr notice), security deposit protections, and protection from retaliation.\n\nLandlord rights include timely rent, eviction for violations (with due process), and property access with notice.\n\nSelf-help evictions are illegal in every state.\n\nRelevant Law: State landlord-tenant statutes; Fair Housing Act (42 U.S.C. §§ 3601-3619)`,
        source: 'Fair Housing Act',
        jurisdiction: 'Federal (US)',
    },
    {
        title: 'LLC Formation Checklist',
        category: 'Business Formation',
        content: `Steps to form an LLC:\n\n1. Choose a business name (check availability)\n2. File Articles of Organization with the state\n3. Obtain an EIN from the IRS\n4. Create an Operating Agreement\n5. Open a business bank account\n6. Obtain required licenses and permits\n7. Set up accounting and tax reporting\n\nCost: $50-$500 depending on state`,
        source: 'SBA Guidelines',
        jurisdiction: 'Federal (US)',
    },
    {
        title: 'Non-Compete Agreement Enforceability',
        category: 'Employment Law',
        content: `Non-compete enforceability varies by state:\n\nFactors courts consider:\n- Reasonable geographic scope\n- Reasonable time duration (typically 1-2 years)\n- Protection of legitimate business interests\n- Not unduly burdensome to the employee\n\nSome states (California, Oklahoma, North Dakota) ban non-competes entirely.\n\nFTC proposed rule (2024) would ban most non-competes nationally.`,
        source: 'State Employment Law',
        jurisdiction: 'Federal (US)',
    },
];

async function main() {
    console.log('Seeding legal knowledge base...');

    for (const item of KNOWLEDGE_DATA) {
        await prisma.legalKnowledge.create({ data: item });
        console.log(`  [OK] ${item.title}`);
    }

    console.log(`\nSeeded ${KNOWLEDGE_DATA.length} knowledge entries successfully!`);
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
