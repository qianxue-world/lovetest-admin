# Kubernetes 部署文档

## 概述

本项目使用 Kustomize 管理 Kubernetes 资源，所有资源部署在 `lovetest` namespace 下。

## 资源清单

- `namespace.yaml` - lovetest 命名空间
- `deployment.yaml` - 应用部署配置（1个副本）
- `service.yaml` - ClusterIP 服务
- `ingress.yaml` - Nginx Ingress 配置
- `kustomization.yaml` - Kustomize 配置文件

## 快速部署

### 方法1：使用 kubectl + kustomize

```bash
# 部署所有资源
kubectl apply -k k8s/

# 查看部署状态
kubectl get all -n lovetest

# 查看 ingress
kubectl get ingress -n lovetest
```

### 方法2：使用 kustomize 命令

```bash
# 预览将要部署的资源
kustomize build k8s/

# 部署
kustomize build k8s/ | kubectl apply -f -
```

### 方法3：ArgoCD（推荐生产环境）

创建 ArgoCD Application：

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: lovetest-admin
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/YOUR_USERNAME/lovetest-admin.git
    targetRevision: main
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: lovetest
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```

## 配置说明

### Namespace

所有资源部署在 `lovetest` namespace：

```yaml
namespace: lovetest
```

### Deployment

- **副本数**: 1
- **镜像**: omaticaya/lovetest-admin:latest
- **资源限制**:
  - CPU: 50m (request) / 100m (limit)
  - Memory: 64Mi (request) / 256Mi (limit)
- **健康检查**:
  - Liveness Probe: HTTP GET / (30s延迟)
  - Readiness Probe: HTTP GET / (5s延迟)

### Service

- **类型**: ClusterIP
- **端口**: 80
- **名称**: lovetest-admin-service

### Ingress

- **域名**: admin.lovetest.com.cn
- **TLS**: 启用（使用 cert-manager）
- **Ingress Class**: nginx
- **证书**: lovetest-admin-tls (自动签发)

## 管理命令

### 查看资源

```bash
# 查看所有资源
kubectl get all -n lovetest

# 查看 pods
kubectl get pods -n lovetest

# 查看 deployment
kubectl get deployment -n lovetest

# 查看 service
kubectl get svc -n lovetest

# 查看 ingress
kubectl get ingress -n lovetest
```

### 查看日志

```bash
# 查看 pod 日志
kubectl logs -n lovetest -l app=lovetest-admin

# 实时查看日志
kubectl logs -n lovetest -l app=lovetest-admin -f

# 查看最近100行日志
kubectl logs -n lovetest -l app=lovetest-admin --tail=100
```

### 扩缩容

```bash
# 扩展到3个副本
kubectl scale deployment lovetest-admin -n lovetest --replicas=3

# 或修改 deployment.yaml 中的 replicas 值后重新应用
kubectl apply -k k8s/
```

### 更新镜像

```bash
# 方法1：直接更新
kubectl set image deployment/lovetest-admin \
  lovetest-admin=omaticaya/lovetest-admin:v2.0.0 \
  -n lovetest

# 方法2：修改 kustomization.yaml 中的 newTag 后重新应用
kubectl apply -k k8s/

# 查看滚动更新状态
kubectl rollout status deployment/lovetest-admin -n lovetest
```

### 回滚

```bash
# 查看历史版本
kubectl rollout history deployment/lovetest-admin -n lovetest

# 回滚到上一个版本
kubectl rollout undo deployment/lovetest-admin -n lovetest

# 回滚到指定版本
kubectl rollout undo deployment/lovetest-admin -n lovetest --to-revision=2
```

### 重启

```bash
# 重启 deployment（滚动重启）
kubectl rollout restart deployment/lovetest-admin -n lovetest
```

### 调试

```bash
# 进入 pod
kubectl exec -it -n lovetest deployment/lovetest-admin -- sh

# 查看 pod 详情
kubectl describe pod -n lovetest -l app=lovetest-admin

# 查看 deployment 详情
kubectl describe deployment lovetest-admin -n lovetest

# 查看 ingress 详情
kubectl describe ingress lovetest-admin-ingress -n lovetest
```

## 删除资源

```bash
# 删除所有资源（保留 namespace）
kubectl delete -k k8s/ --ignore-not-found=true

# 删除 namespace（会删除其中所有资源）
kubectl delete namespace lovetest
```

## 环境变量配置

如需添加环境变量，修改 `deployment.yaml`：

```yaml
spec:
  containers:
  - name: lovetest-admin
    image: omaticaya/lovetest-admin:latest
    env:
    - name: VITE_API_BASE_URL
      value: "https://api.lovetest.com.cn"
    - name: NODE_ENV
      value: "production"
```

或使用 ConfigMap：

```bash
# 创建 ConfigMap
kubectl create configmap lovetest-admin-config \
  --from-literal=VITE_API_BASE_URL=https://api.lovetest.com.cn \
  -n lovetest

# 在 deployment.yaml 中引用
envFrom:
- configMapRef:
    name: lovetest-admin-config
```

## Secret 管理

如需存储敏感信息：

```bash
# 创建 Secret
kubectl create secret generic lovetest-admin-secret \
  --from-literal=api-key=your-secret-key \
  -n lovetest

# 在 deployment.yaml 中引用
env:
- name: API_KEY
  valueFrom:
    secretKeyRef:
      name: lovetest-admin-secret
      key: api-key
```

## 监控和告警

### 查看资源使用情况

```bash
# 查看 pod 资源使用
kubectl top pods -n lovetest

# 查看 node 资源使用
kubectl top nodes
```

### 事件监控

```bash
# 查看 namespace 事件
kubectl get events -n lovetest --sort-by='.lastTimestamp'

# 持续监控事件
kubectl get events -n lovetest --watch
```

## 故障排查

### Pod 无法启动

```bash
# 查看 pod 状态
kubectl get pods -n lovetest

# 查看 pod 详情
kubectl describe pod <pod-name> -n lovetest

# 查看日志
kubectl logs <pod-name> -n lovetest
```

### Ingress 无法访问

```bash
# 检查 ingress 配置
kubectl describe ingress lovetest-admin-ingress -n lovetest

# 检查 ingress controller
kubectl get pods -n ingress-nginx

# 检查 DNS 解析
nslookup admin.lovetest.com.cn

# 检查证书
kubectl get certificate -n lovetest
kubectl describe certificate lovetest-admin-tls -n lovetest
```

### 服务无法访问

```bash
# 检查 service
kubectl get svc -n lovetest
kubectl describe svc lovetest-admin-service -n lovetest

# 检查 endpoints
kubectl get endpoints -n lovetest

# 端口转发测试
kubectl port-forward -n lovetest svc/lovetest-admin-service 8080:80
# 然后访问 http://localhost:8080
```

## CI/CD 集成

### GitHub Actions

项目已配置自动构建和推送 Docker 镜像到 Docker Hub。

ArgoCD 会自动检测镜像更新并部署。

### 手动触发部署

```bash
# 更新镜像标签
kubectl set image deployment/lovetest-admin \
  lovetest-admin=omaticaya/lovetest-admin:latest \
  -n lovetest

# 或使用 kubectl apply
kubectl apply -k k8s/
```

## 最佳实践

1. **使用特定版本标签**：避免使用 `latest` 标签，使用具体版本号如 `v2.0.0`
2. **设置资源限制**：合理设置 CPU 和内存限制
3. **配置健康检查**：确保 liveness 和 readiness probe 正确配置
4. **使用 HPA**：根据负载自动扩缩容
5. **监控和日志**：集成 Prometheus 和 ELK/Loki
6. **备份配置**：定期备份 Kubernetes 配置

## 相关链接

- [Kustomize 文档](https://kustomize.io/)
- [Kubernetes 文档](https://kubernetes.io/docs/)
- [ArgoCD 文档](https://argo-cd.readthedocs.io/)
- [Nginx Ingress 文档](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager 文档](https://cert-manager.io/docs/)
