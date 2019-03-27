export default Object.freeze({
  detailType: {
    FIRE_STATION: 1,
    PUBLIC_HOSPITAL: 2,
    PRIVATE_HOSPITAL: 3,
    INCIDENT: 4,
  },
  incidentStatus: {
    DISPATCHED: 'DISPATCHED',
    ON_THE_WAY: 'ON-THE-WAY',
    ON_SITE: 'ON-SITE',
    ENROUTE: 'ENROUTE BACK',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED',
  },
  socketEvents: {
    NEW_INCIDENT: 1,
    ESCALATE_INCIDENT: 2,
  },
  staffRole: {
    OPS_MANAGER: 'Ops Center Manager',
    OPS_OPERATOR: 'Ops Center Operator',
    OPS_GROUNDCOMM: 'Ops Ground Commander',
    SPECIALIST: 'Specialist',
    RELATIONS_OFFICER: 'Relations Officer',
  },
});
