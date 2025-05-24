# Set the output file path
OUTPUT_FILE="./swagger.json"

# URL of the JSON to download
URL="https://localhost:5104/swagger/v1/swagger.json"

curl -o "$OUTPUT_FILE" -k "$URL"
openapi-generator-cli generate -i "$OUTPUT_FILE" -g typescript-fetch -o "./src/lib/api-client"
rm "$OUTPUT_FILE"
rm "./openapitools.json"