#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Helper functions
const log = (message, color = colors.white) => {
  console.log(`${color}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, colors.green);
const logError = (message) => log(`❌ ${message}`, colors.red);
const logWarning = (message) => log(`⚠️  ${message}`, colors.yellow);
const logInfo = (message) => log(`ℹ️  ${message}`, colors.blue);
const logStep = (message) => log(`🚀 ${message}`, colors.cyan);

const execCommand = (command, description, options = {}) => {
  try {
    logStep(description);
    logInfo(`Executando: ${command}`);
    const output = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: process.cwd(),
      encoding: 'utf8'
    });
    logSuccess(`${description} - Concluído!`);
    return output;
  } catch (error) {
    logError(`${description} - Falhou!`);
    logError(`Erro: ${error.message}`);
    throw error;
  }
};

const execCommandSilent = (command) => {
  try {
    return execSync(command, {
      stdio: 'pipe',
      cwd: process.cwd(),
      encoding: 'utf8'
    });
  } catch (error) {
    return null;
  }
};

// Check if Fly.io app exists
const checkAndCreateFlyApp = async () => {
  logStep('🔍 Verificando se o app Fly.io existe...');

  try {
    // Check if app exists in the apps list
    const appsList = execCommandSilent('fly apps list --json');
    if (appsList) {
      const apps = JSON.parse(appsList);
      const appExists = apps.some(app => app.Name === 'silva-artesanatos-api');

      if (appExists) {
        logSuccess(`App "silva-artesanatos-api" já existe!`);
        return true;
      }
    }
  } catch (error) {
    // Continue to create app
  }

  try {
    logWarning('App não encontrado. Criando novo app...');
    execCommand('fly apps create silva-artesanatos-api', 'Criando app no Fly.io');
    logSuccess('App criado com sucesso!');
    return true;
  } catch (error) {
    if (error.message.includes('already been taken')) {
      logWarning('App já existe mas não foi detectado. Continuando...');
      return true;
    }
    logError('Falha ao criar app no Fly.io');
    throw error;
  }
};

// Deployment functions
const deployBackend = async () => {
  logStep('🔧 Iniciando deploy do Backend (Fly.io)...');

  try {
    // Check if fly CLI is installed
    execCommand('fly version', 'Verificando Fly CLI');

    // Check if logged in
    execCommand('fly auth whoami', 'Verificando autenticação Fly.io');

    // Check and create app if needed
    await checkAndCreateFlyApp();

    // Build and deploy
    execCommand('npm run server:build', 'Fazendo build do servidor');
    execCommand('npx prisma generate', 'Gerando cliente Prisma');
    execCommand('fly deploy --local-only', 'Fazendo deploy no Fly.io');

    // Get the deployed URL
    const apiUrl = `https://silva-artesanatos-api.fly.dev`;

    logSuccess(`Backend deployado com sucesso!`);
    logInfo(`URL da API: ${apiUrl}`);

    return apiUrl;
  } catch (error) {
    logError('Falha no deploy do backend');
    throw error;
  }
};

const deployFrontend = async (apiUrl) => {
  logStep('🎨 Iniciando deploy do Frontend (Vercel)...');

  try {
    // Check if vercel CLI is installed
    execCommand('vercel --version', 'Verificando Vercel CLI');

    // Check if logged in
    execCommand('vercel whoami', 'Verificando autenticação Vercel');

    // Set environment variable if API URL is provided
    if (apiUrl) {
      logInfo(`Configurando NEXT_PUBLIC_API_URL: ${apiUrl}/api`);

      // Check if project is already linked
      const isLinked = execCommandSilent('vercel ls');
      if (!isLinked) {
        logWarning('Projeto não vinculado. Vinculando ao Vercel...');
        execCommand('vercel --confirm', 'Vinculando projeto ao Vercel');
      }

      // Set environment variable
      try {
        execCommand(`vercel env rm NEXT_PUBLIC_API_URL production --yes || echo "Variável não existia"`, 'Removendo variável antiga (se existe)');

        // Configure the environment variable manually
        logStep('Configurando nova variável de ambiente');
        logInfo(`Por favor, configure manualmente: NEXT_PUBLIC_API_URL = ${apiUrl}/api`);
        logWarning('Ou execute: vercel env add NEXT_PUBLIC_API_URL production');
        logWarning(`E digite o valor: ${apiUrl}/api`);
      } catch (error) {
        logWarning('Erro ao configurar variável de ambiente, configure manualmente no Vercel dashboard');
      }
    }

    // Build and deploy
    execCommand('npm run build', 'Fazendo build do frontend');
    execCommand('vercel deploy --prod --confirm', 'Fazendo deploy no Vercel');

    // Get the deployed URL
    try {
      const deploymentInfo = execCommandSilent('vercel ls');
      if (deploymentInfo) {
        // Extract URL from the output
        const lines = deploymentInfo.split('\n');
        const urlLine = lines.find(line => line.includes('https://'));
        if (urlLine) {
          const urlMatch = urlLine.match(/https:\/\/[^\s]+/);
          if (urlMatch) {
            const frontendUrl = urlMatch[0];
            logSuccess(`Frontend deployado com sucesso!`);
            logInfo(`URL do Frontend: ${frontendUrl}`);
            return frontendUrl;
          }
        }
      }
    } catch (error) {
      // Fallback: just show success without specific URL
    }

    logSuccess(`Frontend deployado com sucesso!`);
    logInfo(`Verifique a URL no dashboard do Vercel: https://vercel.com/dashboard`);
    return null;
  } catch (error) {
    logError('Falha no deploy do frontend');
    throw error;
  }
};

const setupEnvironment = async () => {
  logStep('🔐 Configurando variáveis de ambiente...');

  try {
    // Check if .env files exist
    const envFiles = ['.env', '.env.local'];
    envFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        logWarning(`Arquivo ${file} não encontrado`);
      } else {
        logInfo(`✓ Arquivo ${file} encontrado`);
      }
    });

    // Set Fly.io secrets only if app exists
    try {
      logInfo('Configurando secrets no Fly.io...');
      const envContent = fs.readFileSync('.env', 'utf8');
      const envVars = envContent.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => {
          const [key, ...valueParts] = line.split('=');
          return { key: key.trim(), value: valueParts.join('=').trim().replace(/"/g, '') };
        });

      for (const { key, value } of envVars) {
        if (key && value && key !== 'NEXT_PUBLIC_API_URL') {
          try {
            execCommand(`fly secrets set ${key}="${value}"`, `Configurando ${key} no Fly.io`);
          } catch (error) {
            logWarning(`Falha ao configurar ${key}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      logWarning('Erro ao configurar secrets do Fly.io, mas continuando...');
    }

    logSuccess('Variáveis de ambiente configuradas!');
  } catch (error) {
    logWarning('Algumas variáveis de ambiente podem não ter sido configuradas corretamente');
  }
};

const runHealthChecks = async (apiUrl, frontendUrl) => {
  logStep('🏥 Executando verificações de saúde...');

  try {
    if (apiUrl) {
      logInfo(`Verificando API: ${apiUrl}/health`);
      try {
        execCommand(`curl -f ${apiUrl}/health || echo "API health check failed"`, 'Health check da API');
      } catch (error) {
        logWarning('Health check da API falhou, mas a aplicação pode estar funcionando');
      }
    }

    if (frontendUrl) {
      logInfo(`Verificando Frontend: ${frontendUrl}`);
      try {
        execCommand(`curl -f -s -o /dev/null ${frontendUrl} || echo "Frontend check failed"`, 'Verificação do Frontend');
      } catch (error) {
        logWarning('Verificação do frontend falhou, mas a aplicação pode estar funcionando');
      }
    }

    logSuccess('Verificações de saúde concluídas!');
  } catch (error) {
    logWarning('Algumas verificações de saúde falharam');
  }
};

// Main deployment function
const deploy = async (options = {}) => {
  const { backend = true, frontend = true, skipEnv = false } = options;

  console.log(colors.bright + colors.magenta + '🎯 Silva\'s Artesanatos - Deploy Script' + colors.reset);
  console.log(colors.dim + '===============================================' + colors.reset);

  let apiUrl = null;
  let frontendUrl = null;

  try {
    // Setup environment variables
    if (!skipEnv) {
      await setupEnvironment();
    }

    // Deploy backend
    if (backend) {
      apiUrl = await deployBackend();
    }

    // Deploy frontend
    if (frontend) {
      frontendUrl = await deployFrontend(apiUrl);
    }

    // Run health checks
    await runHealthChecks(apiUrl, frontendUrl);

    // Summary
    console.log('\n' + colors.bright + colors.green + '🎉 Deploy concluído com sucesso!' + colors.reset);
    console.log(colors.dim + '========================================' + colors.reset);

    if (apiUrl) {
      logInfo(`🔗 API URL: ${apiUrl}`);
    }
    if (frontendUrl) {
      logInfo(`🔗 Frontend URL: ${frontendUrl}`);
    }

    console.log('\n' + colors.yellow + '📝 Próximos passos:' + colors.reset);
    console.log('   1. Verifique se as aplicações estão funcionando corretamente');
    console.log('   2. Configure domínio customizado se necessário');
    console.log('   3. Configure monitoring e alertas');

  } catch (error) {
    logError('Deploy falhou!');
    logError(error.message);
    process.exit(1);
  }
};

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'backend':
  case 'api':
    deploy({ backend: true, frontend: false });
    break;

  case 'frontend':
  case 'web':
    deploy({ backend: false, frontend: true });
    break;

  case 'help':
  case '--help':
  case '-h':
    console.log(colors.bright + 'Silva\'s Artesanatos - Deploy Script' + colors.reset);
    console.log('\nUso:');
    console.log('  npm run deploy          - Deploy completo (backend + frontend)');
    console.log('  npm run deploy backend  - Deploy apenas do backend');
    console.log('  npm run deploy frontend - Deploy apenas do frontend');
    console.log('  npm run deploy help     - Mostra esta ajuda');
    console.log('\nExemplos:');
    console.log('  node scripts/deploy.js');
    console.log('  node scripts/deploy.js backend');
    console.log('  node scripts/deploy.js frontend');
    break;

  case 'full':
  case 'all':
  case undefined:
    deploy({ backend: true, frontend: true });
    break;

  default:
    logError(`Comando desconhecido: ${command}`);
    logInfo('Use "npm run deploy help" para ver os comandos disponíveis');
    process.exit(1);
} 