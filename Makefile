.PHONY: demo
demo:
		kustomize build . | kubectl apply -f -

.ONESHELL:
.PHONY: credentials
credentials:
		@cat <<-'EOF' > migrations.env
		DB_URL=postgres://bugbounty:test@postgres.database:5432/bugbounty?sslmode=disable
		EOF
		@cat <<-'EOF' > database.env
		POSTGRES_USER=bugbounty
		POSTGRES_PASSWORD=test
		EOF
		@cat <<-'EOF' > api.env
		DB_PASS=test
		EOF
