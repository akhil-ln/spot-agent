// Offline fallback — mirrors data/demo_scenarios.json on the server.
// Used only if GET /api/scenarios fails (no backend / no network).
import scenarios from "./demo_scenarios_data.json";
export default scenarios;
