import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "http://localhost:9200", // Elasticsearch server
  auth: {
    username: "elastic",
    password: "your_password_here", // We'll handle this shortly
  },
  tls: {
    rejectUnauthorized: false, // Disable for dev only
  },
});

export default client;
