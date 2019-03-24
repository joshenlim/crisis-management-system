export default Object.freeze({
  detailType: {
    FIRE_STATION: 1,
    PUBLIC_HOSPITAL: 2,
    PRIVATE_HOSPITAL: 3,
    INCIDENT: 4,
  },
  incidentStatus: {
    DISPATCHED: 'DISPATCHED',
    ON_SITE: 'ON-SITE',
    ENROUTE: 'ENROUTE BACK',
  },
  socketEvents: {
    NEW_INCIDENT: 1,
    ESCALATE_INCIDENT: 2,
  },
});
