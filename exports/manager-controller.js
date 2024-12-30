import createLead from "../controller/manager/create-lead.js";
import addLeadPOC from "../controller/manager/add-lead-poc.js";
import placeOrder from "../controller/manager/place-order.js";
import updateInteraction from "../controller/manager/update-interaction.js";
import setCallFrequency from "../controller/manager/set-call-frequency.js";
import getScheduledCalls from "../controller/manager/get-scheduled-calls.js";
import getOrderingPatternsAndFrequency from "../controller/manager/get-order-pattern-frequency.js";
import getLeadPerformance from "../controller/manager/high-low-performing-leads.js";
import changeStatus from "../controller/manager/change-lead-status.js";
import getAllLeads from "../controller/manager/get-all-leads.js";
import getLeadById from "../controller/manager/get-lead-by-id.js";
const managerController = {
    createLead,
    addLeadPOC,
    placeOrder,
    updateInteraction,
    setCallFrequency,
    getScheduledCalls,
    getOrderingPatternsAndFrequency,
    getLeadPerformance,
    changeStatus,
    getAllLeads,
    getLeadById
}

export default managerController;