# Automated Deployment Setup

## What's Configured

Your project now has a fully automated CI/CD pipeline that:

1. **Auto-bumps versions** on every commit to main/master
2. **Builds Docker images** with the new version
3. **Pushes to Docker Hub** with version tag and latest
4. **Commits version changes** back to the repository
5. **Triggers ArgoCD** to deploy the new version

## How It Works

### On Every Commit to Main/Master:

```
Commit → Bump Version → Build Docker → Push to Hub → Update Repo → ArgoCD Deploys
```

1. GitHub Actions detects push to main/master
2. Runs `scripts/bump-version.sh` to increment patch version (2.0.0 → 2.0.1)
3. Updates version in:
   - `package.json`
   - `k8s/kustomization.yaml` 
   - `k8s/deployment.yaml`
   - `VERSION` file
4. Builds multi-architecture Docker image (amd64, arm64)
5. Pushes to Docker Hub with tags: `v2.0.1` and `latest`
6. Commits version changes back with `[skip ci]` to avoid loops
7. ArgoCD detects k8s/ changes and deploys new version

## Files Modified/Created

### Created:
- `scripts/bump-version.sh` - Version bumping script
- `VERSION` - Version tracking file
- `.github/workflows/README.md` - Workflow documentation
- `DEPLOYMENT.md` - This file

### Modified:
- `.github/workflows/docker-build.yml` - Added version bumping and auto-commit
- `k8s/kustomization.yaml` - Changed from `latest` to `v2.0.0`
- `k8s/deployment.yaml` - Changed from `latest` to `v2.0.0`
- `k8s/README.md` - Added CI/CD documentation

## Required GitHub Secrets

Make sure these are set in your GitHub repository settings:

- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token (not password!)

## Required GitHub Variables

- `DOCKER_IMAGE_NAME` - Set to `lovetest-admin`

## ArgoCD Configuration

Create an ArgoCD Application pointing to your repo:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: lovetest-admin
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/YOUR_USERNAME/YOUR_REPO.git
    targetRevision: main
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: lovetest-admin
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

## Testing the Setup

1. Make a small change to your code
2. Commit and push to main/master
3. Watch GitHub Actions run the workflow
4. Check that version files are updated
5. Verify Docker Hub has the new image
6. Monitor ArgoCD for automatic deployment

## Version Strategy

- **Patch bumps** (2.0.0 → 2.0.1): Automatic on every commit
- **Minor bumps** (2.0.0 → 2.1.0): Manual - edit package.json before commit
- **Major bumps** (2.0.0 → 3.0.0): Manual - edit package.json before commit

## Skipping CI

To commit without triggering build (e.g., documentation changes):

```bash
git commit -m "docs: update README [skip ci]"
```

## Manual Workflow Trigger

Go to GitHub → Actions → "Build and Push Docker Image" → "Run workflow"

## Troubleshooting

### Workflow fails at "Bump version"
- Check `scripts/bump-version.sh` exists and is valid
- Verify `package.json` has proper version format

### Workflow fails at "Commit version changes"
- Ensure GitHub Actions has write permissions
- Check repository settings → Actions → General → Workflow permissions

### ArgoCD not deploying
- Verify ArgoCD is watching the correct repo and path
- Check ArgoCD sync policy is set to automated
- Review ArgoCD application logs

### Docker push fails
- Verify Docker Hub credentials are correct
- Check Docker Hub repository exists and is accessible
- Ensure `DOCKER_IMAGE_NAME` variable is set correctly

## Next Steps

1. Set up GitHub secrets and variables
2. Configure ArgoCD application
3. Test with a small commit
4. Monitor the full pipeline

Your deployment pipeline is now ready! 🚀
