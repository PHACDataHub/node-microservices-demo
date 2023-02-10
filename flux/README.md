# Flux

This folder contains the config needed to deploy the system with flux.
The config here was generated with the following commands:

```bash
# generate flux crds with only the features we use
flux install --export --components=source-controller,kustomize-controller,notification-controller > flux-crds.yaml
# Tell flux what repo and branch to watch
flux create source git github-repo --export --branch main --url "https://github.com/PHACDataHub/node-microservices-demo.git" > github-repo.yaml
# tell flux to `kustomize build | kubectl apply` the ingress folder for that repo
flux create kustomization ingress --export --path ingress --source github-repo > ingress-kustomization.yaml
# tell flux to `kustomize build | kubectl apply` the ui folder after istio starts
# Istio needs to be running for it to inject sidecar containers
flux create kustomization ui --export --path ui --source github-repo --health-check=Deployment/istio-ingressgateway.istio-system --health-check=Deployment/istiod.istio-system > ui-kustomization.yaml
# tell flux to `kustomize build | kubectl apply` the database folder after istio starts
flux create kustomization database --export --path database --source github-repo --health-check=Deployment/istio-ingressgateway.istio-system --health-check=Deployment/istiod.istio-system > database-kustomization.yaml
# tell flux to `kustomize build | kubectl apply` the api folder after istio and the database start
flux create kustomization api --export --path api --source github-repo --health-check=Deployment/istio-ingressgateway.istio-system --health-check=Deployment/istiod.istio-system --health-check=Deployment/postgres.database > api-kustomization.yaml
```
