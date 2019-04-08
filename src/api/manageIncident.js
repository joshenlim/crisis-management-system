import express from 'express';
import MySQLDB from '../database';
import config from '../config';
import moment from 'moment';
import PDF from 'pdfkit';
import fs from 'fs';

const router = express.Router({ mergeParams: true });

const database = new MySQLDB(config.mysql_config);
database.connect();

router.get('/get', async (req, res) => {
  const { id, emergency } = req.query;
  var incidents;
  if (emergency) {
    incidents = await database.getEmergencyIncidentByID(id);
  } else {
    incidents = await database.getIncidentByID(id);
  }
  return res.status(200).send(incidents);
});

router.get('/get_gc_active_incident', async (req, res) => {
  const { plate } = req.query;
  const incidentDetail = await database.getGCActiveIncident(plate);
  return res.status(200).send(incidentDetail);
});

router.get('/get_casualty_list', async (req, res) => {
  const { id } = req.query;
  const casualtyList = await database.getCasualtyList(id);
  return res.status(200).send(casualtyList);
});

router.get('/get_RTA_details', async (req, res) => {
  const { id } = req.query;
  const incidentDetail = await database.getRTADetails(id);
  return res.status(200).send(incidentDetail);
});

router.get('/get_FE_details', async (req, res) => {
  const { id } = req.query;
  const incidentDetail = await database.getFEDetails(id);
  return res.status(200).send(incidentDetail);
});

router.get('/get_ME_details', async (req, res) => {
  const { id } = req.query;
  const incidentDetail = await database.getMEDetails(id);
  return res.status(200).send(incidentDetail);
});

router.get('/get_vehicleIncident', async (req, res) => {
  const { id } = req.query;
  const incidents = await database.getDispatchedVehicles(id);
  return res.status(200).send(incidents);
});

router.get('/get_ongoing', async (req, res) => {
  const incidents = await database.getOngoingIncidents();
  return res.status(200).send(incidents);
});

router.get('/get_by_status', async (req, res) => {
  const { status } = req.query;
  const incidents = await database.getIncidentByStatus(status);
  return res.status(200).send(incidents);
});

router.get('/get_escalated', async (req, res) => {
  const incidents = await database.getEscalated();
  return res.status(200).send(incidents);
});

router.post('/create', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  const newIncidentId = await database.createIncident(reqBody);

  switch (req.body.category) {
    case 'road_traffic_accident': {
      await database.createRoadIncident(newIncidentId, reqBody);
      return res.status(200).send({
        success: 'Incident successfully created',
        incident_id: newIncidentId,
      });
      break;
    }
    case 'medical_emergency': {
      await database.createMedicalIncident(newIncidentId, reqBody);
      return res.status(200).send({
        success: 'Incident successfully created',
        incident_id: newIncidentId,
      });
      break;
    }
    case 'fire_emergency': {
      await database.createFireIncident(newIncidentId, reqBody);
      return res.status(200).send({
        success: 'Incident successfully created',
        incident_id: newIncidentId,
      });
      break;
    }
    case 'gas_leak': {
      return res.status(200).send({
        success: 'Incident successfully created',
        incident_id: newIncidentId,
      });
      break;
    }
  }
});

router.post('/update', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.updateIncident(reqBody);
  return res.status(200).send({
    Success: 'Incident successfully updated',
  });
});

router.post('/update_status', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.updateStatus(reqBody);
  return res.status(201).send({
    Success: 'Incident successfully updated',
  });
});

router.post('/update_gc_veh_status', async (req, res) => {
  const { status, incident_id, plate_number } = req.body
  await database.updateGCVehStatus(status, incident_id, plate_number);
  return res.status(201).send({
    Success: 'GC Vehicle successfully updated',
  });
});

router.post('/add_casualty_info', async (req, res) => {
  const body = {
    ...req.body,
  }
  await database.addCasualtyInformation(body);
  return res.status(200).send({
    Success: 'Casualty Information successfully added',
  });
});

router.post('/update_escalation', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.updateEscalation(reqBody);
  return res.status(201).send({
    Success: 'Incident escalation successfully updated',
  });
});

router.post('/create_civil_emergency', async (req, res) => {
  const reqBody = {
    ...req.body,
    ce_handle_id: req.user.id,
    ce_upload_id: req.user.id,
  };
  await database.createCivilEmergency(reqBody);
  return res.status(200).send({
    Success: 'Civil emergency successfully created',
  });
});

router.post('/dispatch', async (req, res) => {
  await database.dispatchVehicle(req.body);
  return res.status(201).send({
    Success: 'Dispatch additional units successfully',
  });
});

router.post('/close_incident', async (req, res) => {
  const { incident_id } = req.body;
  const completed_at = moment().format('YYYY-MM-DD kk:mm:ss');
  await database.closeIncident(incident_id, completed_at);
  return res.status(200).send({
    Success: 'Closed incident succesfully',
  });
});

router.post('/set_incident_alert', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.setIncidentAlert(reqBody);
  return res.status(201).send({
    Success: 'Incident alert successfully updated',
  });
});

router.post('/set_road_traffic_alert', async (req, res) => {
  const reqBody = {
    ...req.body,
    op_id: req.user.id,
  };
  await database.setRoadTrafficAlert(reqBody);
  return res.status(201).send({
    Success: 'Road traffic alert successfully updated',
  });
});

router.get('/get_ce_desc', async (req, res) => {
  const { incident_id } = req.query;
  const desc = await database.getCEDesc(incident_id);
  return res.status(200).send(desc);
});

router.post('/add_ce_desc', async (req, res) => {
  const reqBody = {
    specialist_id: req.session.passport.user.id, //Front End ignore this
    ce_incident_id: req.body.ce_incident_id,
    description: req.body.description,
  };
  await database.addCEDesc(reqBody);
  return res.status(201).send({
    Success: 'Civil Emergency description successfully added',
  });
});

router.post('/remove_ce_desc', async (req, res) => {
  const { ce_desc_id } = req.body;
  await database.removeCEDesc(ce_desc_id);
  return res.status(201).send({
    Success: 'Civil Emergency description successfully removed',
  });
});

// on click of generate report button (by today or this week)
// call t
// get data from the incidents table by current date or 7 days before and plus current date
// create content for each incident one page at a time
// each line represent different information
// save pdf into server with directory named reports
// automatically instantiate download for the specialist user [kiv]
// remember to edit on gitignore
router.post('/generate_dailyreport', async (req, res) => {
  const incidents = await database.getIncidentByCurrentDate(); // need to select according to current date for completed_at

  // create current datetime
  var datetime = moment().format('YYYY-MM-DD kk:mm:ss');

  // create reportdate
  var reportdate = moment().format('YYYY-MM-DD');

  // creating a new PDF object
  var doc = new PDF();

  // check if reports folder exist
  if (!fs.existsSync('./reports')) {
    fs.mkdirSync('./reports');
  }

  // creating a write stream
  if (incidents.length > 0) {
    // creating a write stream
    var dir = './reports/DailyReport_' + reportdate + '.pdf';
    doc.pipe(fs.createWriteStream(dir));
    doc.fontSize(16).text('Overall Daily Report generated on ' + datetime);
    doc.moveDown();

    for (var i = 0; i < incidents.length; i++) {
      // store data from db - incident's table
      var text = 'Case No. ' + (i + 1);
      var text1 = 'Caller Name: ' + incidents[i].caller_name + '.';
      var text2 = 'Caller Contact: ' + incidents[i].caller_contact + '.';
      var text3 = 'Postal Code: ' + incidents[i].postal_code + '.';
      var text4 = 'Address: ' + incidents[i].address + '.';
      var text5 = 'Date of Incident: ' + incidents[i].created_at + '.';
      var text6 =
        'Completion Date of Incident: ' + incidents[i].completed_at + '.';
      var text7 = 'No. of Casualties: ' + incidents[i].casualty_no + '.';
      var text8 = 'Incident Category: ' + incidents[i].category + '.';
      var text9 = 'Descriptions: ' + incidents[i].description + '.';

      // to write the content on the file system
      doc.fontSize(14).text(text);
      doc.moveDown();
      doc.fontSize(12).text(text1);
      doc.moveDown();
      doc.text(text2);
      doc.moveDown();
      doc.text(text3);
      doc.moveDown();
      doc.text(text4);
      doc.moveDown();
      doc.text(text5);
      doc.moveDown();
      doc.text(text6);
      doc.moveDown();
      doc.text(text7);
      doc.moveDown();
      doc.text(text8);
      doc.moveDown();
      doc.text(text9);

      if (i + 1 != incidents.length) {
        doc.addPage();
      }
      // adding the text to be written,
      // more things can be added here including new pages
    }

    doc.on('end', () => {
      return res.status(201).send({
        Success: 'Report generated successfully',
      });
    });

    doc.end(); // we end the document writing
  } else {
    return res
      .status(201)
      .send(
        'Daily Report cannot be generated because of 0 such records with the current date (as completed_at) on the database',
      );
  }

  // download the PDF
  //doc.createPdf(docDefinition).download();
});

router.post('/generate_weeklyreport', async (req, res) => {
  const incidents = await database.getIncidentBySixDaysBeforeCurrentDate(); // need to select according to (from current date - 6 to current date) and status = completed

  // create old datetime (6 days before -> weekly)
  var oneweek = moment().subtract(6, 'days');
  var oneweek2 = oneweek.startOf('day');
  var olddatetime = oneweek2.format('YYYY-MM-DD kk:mm:ss');

  // create current datetime
  var datetime = moment().endOf('day');
  var newdatetime = datetime.format('YYYY-MM-DD kk:mm:ss');

  // create report date
  var reportdate = moment().format('YYYY-MM-DD');

  // creating a new PDF object
  var doc = new PDF();

  // check if reports folder exist
  if (!fs.existsSync('./reports')) {
    fs.mkdirSync('./reports');
  }

  // creating a write stream
  if (incidents.length > 0) {
    var dir = './reports/WeeklyReport_' + reportdate + '.pdf';
    doc.pipe(fs.createWriteStream(dir));
    doc
      .fontSize(16)
      .text(
        'Overall Weekly Report generated from ' +
          olddatetime +
          ' to ' +
          newdatetime,
      );
    doc.moveDown();

    for (var i = 0; i < incidents.length; i++) {
      // store data from db - incident's table
      var text = 'Case No. ' + (i + 1);
      var text1 = 'Caller Name: ' + incidents[i].caller_name + '.';
      var text2 = 'Caller Contact: ' + incidents[i].caller_contact + '.';
      var text3 = 'Postal Code: ' + incidents[i].postal_code + '.';
      var text4 = 'Address: ' + incidents[i].address + '.';
      var text5 = 'Date of Incident: ' + incidents[i].created_at + '.';
      var text6 =
        'Completion Date of Incident: ' + incidents[i].completed_at + '.';
      var text7 = 'No. of Casualties: ' + incidents[i].casualty_no + '.';
      var text8 = 'Incident Category: ' + incidents[i].category + '.';
      var text9 = 'Descriptions: ' + incidents[i].description + '.';

      // to write the content on the file system
      doc.fontSize(14).text(text);
      doc.moveDown();
      doc.fontSize(12).text(text1);
      doc.moveDown();
      doc.text(text2);
      doc.moveDown();
      doc.text(text3);
      doc.moveDown();
      doc.text(text4);
      doc.moveDown();
      doc.text(text5);
      doc.moveDown();
      doc.text(text6);
      doc.moveDown();
      doc.text(text7);
      doc.moveDown();
      doc.text(text8);
      doc.moveDown();
      doc.text(text9);

      if (i + 1 != incidents.length) {
        doc.addPage();
      }
      // adding the text to be written,
      // more things can be added here including new pages
    }

    doc.on('end', () => {
      return res.status(201).send({
        Success: 'Report generated successfully',
      });
    });

    doc.end(); // we end the document writing
  } else {
    return res
      .status(201)
      .send('Weekly Report cannot be generated because of 0 records');
  }

  // download the PDF
  //doc.createPdf(docDefinition).download();
});

export default router;
