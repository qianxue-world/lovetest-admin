#!/bin/bash

# Kubernetes 部署脚本
# 用法: ./deploy.sh [apply|delete|status]

set -e

NAMESPACE="lovetest"
APP_NAME="lovetest-admin"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

function print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

function print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

function check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl not found. Please install kubectl first."
        exit 1
    fi
    print_info "kubectl found: $(kubectl version --client --short 2>/dev/null || kubectl version --client)"
}

function check_kustomize() {
    if ! command -v kustomize &> /dev/null; then
        print_warn "kustomize not found. Using kubectl apply -k instead."
        return 1
    fi
    print_info "kustomize found: $(kustomize version --short 2>/dev/null || kustomize version)"
    return 0
}

function deploy() {
    print_info "Deploying $APP_NAME to namespace $NAMESPACE..."
    
    # 预览将要部署的资源
    print_info "Preview resources:"
    if check_kustomize; then
        kustomize build .
    else
        kubectl kustomize .
    fi
    
    echo ""
    read -p "Continue with deployment? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warn "Deployment cancelled."
        exit 0
    fi
    
    # 部署
    kubectl apply -k .
    
    print_info "Waiting for deployment to be ready..."
    kubectl rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=5m
    
    print_info "Deployment completed successfully!"
    show_status
}

function delete_resources() {
    print_warn "This will delete all resources in namespace $NAMESPACE"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warn "Deletion cancelled."
        exit 0
    fi
    
    print_info "Deleting resources..."
    kubectl delete -k . --ignore-not-found=true
    
    print_info "Resources deleted successfully!"
}

function show_status() {
    print_info "Current status:"
    echo ""
    
    echo "=== Namespace ==="
    kubectl get namespace $NAMESPACE 2>/dev/null || print_warn "Namespace not found"
    echo ""
    
    echo "=== Deployments ==="
    kubectl get deployment -n $NAMESPACE 2>/dev/null || print_warn "No deployments found"
    echo ""
    
    echo "=== Pods ==="
    kubectl get pods -n $NAMESPACE 2>/dev/null || print_warn "No pods found"
    echo ""
    
    echo "=== Services ==="
    kubectl get svc -n $NAMESPACE 2>/dev/null || print_warn "No services found"
    echo ""
    
    echo "=== Ingress ==="
    kubectl get ingress -n $NAMESPACE 2>/dev/null || print_warn "No ingress found"
    echo ""
    
    echo "=== Recent Events ==="
    kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' 2>/dev/null | tail -10 || print_warn "No events found"
}

function show_logs() {
    print_info "Showing logs for $APP_NAME..."
    kubectl logs -n $NAMESPACE -l app=$APP_NAME --tail=100 -f
}

function show_help() {
    cat << EOF
Kubernetes Deployment Script for $APP_NAME

Usage: $0 [COMMAND]

Commands:
    apply       Deploy or update the application
    delete      Delete all resources
    status      Show current status
    logs        Show application logs
    restart     Restart the deployment
    scale       Scale the deployment
    help        Show this help message

Examples:
    $0 apply          # Deploy the application
    $0 status         # Check deployment status
    $0 logs           # View logs
    $0 restart        # Restart pods
    $0 scale 3        # Scale to 3 replicas

EOF
}

function restart_deployment() {
    print_info "Restarting deployment $APP_NAME..."
    kubectl rollout restart deployment/$APP_NAME -n $NAMESPACE
    kubectl rollout status deployment/$APP_NAME -n $NAMESPACE
    print_info "Deployment restarted successfully!"
}

function scale_deployment() {
    local replicas=$1
    if [[ -z "$replicas" ]]; then
        print_error "Please specify number of replicas"
        echo "Usage: $0 scale <replicas>"
        exit 1
    fi
    
    print_info "Scaling deployment $APP_NAME to $replicas replicas..."
    kubectl scale deployment/$APP_NAME -n $NAMESPACE --replicas=$replicas
    kubectl rollout status deployment/$APP_NAME -n $NAMESPACE
    print_info "Deployment scaled successfully!"
}

# Main
check_kubectl

case "${1:-help}" in
    apply|deploy)
        deploy
        ;;
    delete|remove)
        delete_resources
        ;;
    status|get)
        show_status
        ;;
    logs|log)
        show_logs
        ;;
    restart)
        restart_deployment
        ;;
    scale)
        scale_deployment $2
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
