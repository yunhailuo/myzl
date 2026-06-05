# CloudBase Static Hosting Deployment

Deploy to Tencent Cloud CloudBase Static Hosting using GitHub Actions.

## Prerequisites

### 1. Install CLI (Optional for Local Testing)

```bash
npm install -g @cloudbase/cli
tcb --version
```

### 2. Get API Keys

1. Login to [Tencent Cloud Console](https://console.cloud.tencent.com/cam/capi)
2. Create or get existing `SecretId` and `SecretKey`
3. Get your CloudBase Environment ID from CloudBase Console

### 3. Configure GitHub Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

Add the following secrets:

- `TCB_SECRET_ID`: Your Tencent Cloud SecretId
- `TCB_SECRET_KEY`: Your Tencent Cloud SecretKey
- `TCB_ENV_ID`: Your CloudBase Environment ID

> ⚠️ **Security**: Never hardcode API keys in code. Use GitHub Secrets.

## Manual Deployment

### Trigger Deployment

1. Go to **Actions** tab in your GitHub repository
2. Select "Deploy to CloudBase Static Hosting" workflow
3. Click "Run workflow"
4. Click "Run workflow" button to start deployment

### Deployment Process

The workflow will:

1. Checkout code
2. Setup Node.js (v20)
3. Install dependencies
4. Build project (`npm run build:root`)
5. Install CloudBase CLI
6. Login to CloudBase
7. Deploy `./dist` to the root `/` path

## Configuration Reference

### Deploy Command

```bash
tcb hosting deploy ./dist / -e ${{ secrets.TCB_ENV_ID }}
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `./dist` | Build output directory | `./build`, `./public` |
| `/` | Cloud target path | `/home`, `/static` |
| `-e` | Environment ID | From GitHub Secrets |

### Custom Configuration

Edit `.github/workflows/deploy-cloudbase.yml` to customize:

```yaml
# Change build command
- name: Build project
  run: VITE_BASE_URL=/home/ npm run build

# Change deploy path
- name: Deploy to CloudBase
  run: tcb hosting deploy ./dist /home -e ${{ secrets.TCB_ENV_ID }}
```

## Troubleshooting

### Authentication Error

**Issue**: `Login failed` or `Authentication error`

**Solution**:
- Verify `TCB_SECRET_ID` and `TCB_SECRET_KEY` in GitHub Secrets
- Check API key is valid and not expired
- Test locally with `tcb login`

### Environment Not Found

**Issue**: `Environment not found`

**Solution**:
- Verify `TCB_ENV_ID` is correct
- Check environment exists in CloudBase Console

### Build Failed

**Issue**: `npm run build:root` fails

**Solution**:
- Check Node.js version (requires v20+)
- Clear cache: `rm -rf node_modules && npm ci`
- Check build logs for specific errors

## Local Testing

```bash
# Build
npm run build:root

# Login (browser authorization)
tcb login

# Deploy
tcb hosting deploy ./dist / -e YOUR_ENV_ID
```

## References

- [CloudBase Documentation](https://docs.cloudbase.net/)
- [CLI Documentation](https://docs.cloudbase.net/cli/)
- [Static Hosting](https://docs.cloudbase.net/hosting/)
