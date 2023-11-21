.PHONY: secrets
secrets:
		kubectl create namespace ui
		kubectl create namespace api
		kubectl create namespace database
		kubectl create secret generic api -n api --from-env-file api.env
		kubectl create secret generic migrations -n api --from-env-file migrations.env
		kubectl create secret generic database -n database --from-env-file database.env

.PHONY: demo
demo: secrets
		kustomize build flux | kubectl apply -f -

# This regenerates the istio manifests while using yq to remove the CRD for the
# operator so it doesn't clash with the istio operator which also includes the
# CRD.  Note: the yq used here is the python (not go) version
.PHONY: update-istio
update-istio:
		istioctl manifest generate --dry-run | yq -y 'select(.metadata.name != "istiooperators.install.istio.io" or .kind != "CustomResourceDefinition") | select (.!=null)' > ingress/istio.yaml

# This regenerates the istio operator manifests, which include the IstioOperator
# CRD that we omitted above
.PHONY: update-istio-operator
update-istio-operator:
		istioctl operator dump --dry-run > ingress/istio-operator.yaml

.ONESHELL:
.PHONY: credentials
credentials:
		@cat <<-'EOF' > migrations.env
		DB_URL=postgres://bugbounty:secret@postgres.database:5432/bugbounty?sslmode=disable
		EOF
		@cat <<-'EOF' > database.env
		POSTGRES_USER=bugbounty
		POSTGRES_PASSWORD=secret
		API_USER=leastprivilegeuser
		API_PASSWORD=test
		EOF
		@cat <<-'EOF' > api.env
		DB_USER=leastprivilegeuser
		DB_PASS=test
		EOF
