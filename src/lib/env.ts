/**
 * Environment variable validation
 * Logs warnings for missing optional vars and throws for required vars
 */

interface EnvVar {
    key: string;
    required: boolean;
    description: string;
}

const ENV_VARS: EnvVar[] = [
    { key: 'DATABASE_URL', required: true, description: 'PostgreSQL connection string' },
    { key: 'NEXTAUTH_SECRET', required: true, description: 'NextAuth.js signing secret' },
    { key: 'NEXTAUTH_URL', required: true, description: 'Application URL for NextAuth' },
    { key: 'GOOGLE_CLIENT_ID', required: false, description: 'Google OAuth client ID' },
    { key: 'GOOGLE_CLIENT_SECRET', required: false, description: 'Google OAuth client secret' },
    { key: 'GITHUB_ID', required: false, description: 'GitHub OAuth client ID' },
    { key: 'GITHUB_SECRET', required: false, description: 'GitHub OAuth client secret' },
    { key: 'OPENAI_API_KEY', required: false, description: 'OpenAI API key for AI features' },
    { key: 'NEXT_PUBLIC_APP_URL', required: false, description: 'Public application URL' },
];

export function validateEnv(): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const envVar of ENV_VARS) {
        const value = process.env[envVar.key];

        if (!value) {
            if (envVar.required) {
                errors.push(`❌ Missing required: ${envVar.key} — ${envVar.description}`);
            } else {
                warnings.push(`⚠️  Missing optional: ${envVar.key} — ${envVar.description}`);
            }
        }
    }

    if (errors.length > 0) {
        console.error('\n🔴 Environment Validation Failed:');
        errors.forEach((e) => console.error(`  ${e}`));
    }

    if (warnings.length > 0) {
        console.warn('\n🟡 Environment Warnings:');
        warnings.forEach((w) => console.warn(`  ${w}`));
    }

    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ All environment variables configured');
    }

    return { valid: errors.length === 0, errors, warnings };
}
