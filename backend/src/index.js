import express from 'express'
import cors from 'cors'
import multer from 'multer'
import {configDotenv} from 'dotenv'
import UserModel from './models/UserModel.js'
import DriverModel from './models/DriverModel.js'
import VendorModel from './models/VendorModel.js'
import VehicleModel from './models/VehicleModel.js'
import MaintenanceModel from './models/MaintenanceModel.js'
import authenticateToken from './middlewares/auth.middleware.js'
import RidesModel from './models/RidesModel.js'
import DailyLogsModel from './models/DailyLogsModel.js'
import AttendanceModel from './models/AttendanceModel.js'
import startDailyJobLog from './controllers/dailylogs.controller.js'
import BackupModel from './models/BackupModel.js'
import AdHOCRidesModel from './models/AdHOCRidesModel.js'
configDotenv();

const app = express();

const upload = multer();

app.use(express.json())
app.use(cors())

const port = process.env.PORT || 8081

//Admin
app.get('/get-users', authenticateToken, async(req, res) => {
    try {
        const result = await UserModel.getUsers();
        res.status(200).send(result.rows);
    } catch (error) {
        res.status(400).send("Error while getting users: " + error)
    }
})


//User register & login routes
app.post('/login', async(req, res) => {
    const {email, password} = req.body;

    try {
        const token = await UserModel.userLogin(email, password);
        res.status(200).send({token: token});
    } catch (error) {
        res.status(400).send(`${error}`);
    }
})

app.post('/register', async(req, res) => {
    const {name, email, password, role, phone_no, address} = req.body;
    try {
        const user = await UserModel.createUser(name, email, password, role, phone_no, address);
        return res.status(201).send("Your User account created successfully with id: " + user.id);
    } catch (error) {
        console.log("Error while registering user: " + error);
        res.status(400).send("Error while registering user: " + error);
    }
})

//Driver Routes
app.post('/register-driver', authenticateToken, async(req, res) => {
    const {license_no, license_type} = req.body;
    try {
        await DriverModel.createDriver(license_no, license_type, req.user_id);
        res.status(201).send("Your Driver account created successfully with license no: " + license_no);
    } catch (error) {
        console.log("Error while registering driver: " + error)
        res.status(400).send("Error while registering driver: " + error)
    }
})
app.get('/driver/get-rides', authenticateToken, async(req, res) => {
    const {driver_id, date} = req.body;
    try {
        const result = await DailyLogsModel.getDailyLogs(driver_id, date);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting rides: " + error)
    }
})

//Vendor Routes
app.post('/register-vendor', authenticateToken, async(req, res) => {
    const {bank_account_no, bank_name, ifsc_code} = req.body;

    try {
        const result = await VendorModel.createVendor(bank_account_no, bank_name, ifsc_code, req.user_id);
        res.status(201).send("Your Vendor account created successfully with bank account no: " + result);
    } catch (error) {
        res.status(400).send("Error while registering vendor: " + error)
    }
})

app.post('/vendor/register-vehicle', authenticateToken, async (req, res) => {
    const { vehicle_no, vehicle_type, vehicle_model, status } = req.body;
    try {
        const result = await VehicleModel.createVehicle(vehicle_no, vehicle_type, vehicle_model, req.user_id, status);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send("Error while registering vehicle: " + error);
    }
});


//Supervisor Routes
app.post('/register-supervisor', authenticateToken, async(req, res) => {
    const {role, user_id} = req.body;
    try {
        await UserModel.updateUser(role, user_id);
        res.status(201).send("Your Supervisor account created successfully with id: " + user_id);
    } catch (error) {
        res.status(400).send("Error while registering supervisor: " + error)
    }
})

app.post('/supervisor/add-vehicle', authenticateToken, async(req, res) => {
    const {vehicle_no, vehicle_type, vehicle_model, status} = req.body;
    try {
        const response = await VehicleModel.createVehicle(vehicle_no, vehicle_type, vehicle_model, status);
        res.sendStatus(201);
    } catch (error) {
        res.status(400).send("Error while adding vehicle: " + error)
    }
})

app.put('/update-log/:id', authenticateToken, async (req, res) => {
    const { id: ride_id } = req.params; // Correct param name
    const { start_time, log_status, start_date} = req.body;

    console.log("Received Payload:", { ride_id, start_time, log_status, start_date });

    if (!ride_id || !start_time || !log_status) {
        console.error("Missing parameters");
        return res.status(400).send("Bad Request: Missing parameters");
    }

    try {
        const result = await DailyLogsModel.startRide(ride_id, start_time, log_status, start_date);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error updating log:", error.message);
        res.status(400).send("Bad Request");
    }
});

app.put('/supervisor/update-vehicle-info/:id', authenticateToken, async(req, res) => {
    const {id} = req.params;
    const {vendor} = req.body;

    try {
        await VehicleModel.updateVehicle(id, vendor);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
})

app.get('/supervisor/drivers', authenticateToken, async(req, res) => {
    try {
        const result = await UserModel.getDrivers();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting drivers: " + error)
    }
})

app.post('/supervisor/update-attendances', authenticateToken, async(req, res) => {
    const {attendanceList} = req.body;

    if(!Array.isArray(attendanceList) || attendanceList.length === 0){
        res.status(400).send("Invalid or empty attendance list");
    }

    try {
        const message = await AttendanceModel.updateAttendances(attendanceList);
        res.status(200).json({message});
    } catch (error) {
        res.status(500).json({error: 'Failed to update attendances.'});
    }
})

app.post('/supervisor/add-log', authenticateToken, async(req, res) => {
    const {ride_id, start_date, start_time, vehicle_no, driver_id, vendor_id} = req.body;

    try {
        const result = await DailyLogsModel.addDailyLog(ride_id, start_date, start_time, vehicle_no, driver_id, vendor_id);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send("Error while adding log: " + error)
    }
})

app.post('/supervisor/end-ride/:id', authenticateToken, async(req, res) => {
    const {id} = req.params;
    const {end_time} = req.body;

    try {
        const start_date = await DailyLogsModel.getLastLogStartDate(id);
        const result = await DailyLogsModel.endRide(id, start_date, end_time);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send(`${error}`)
    }
})

//Supervisor Routes - AdHOC

app.get('/supervisor/get-rides', authenticateToken, async(req, res) => {
    const {date} = req.query;

    try {
        const result = {
            rides: date ? await AdHOCRidesModel.getRidesByDate(date) : await AdHOCRidesModel.getRides()
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting rides: " + error)
    }
})

app.post('/supervisor/add-ride', authenticateToken, async(req, res) => {
    const {client_name, client_phone_no, vehicle_no, driver_name, price, date} = req.body;
    try {
        const result = await AdHOCRidesModel.addRide(client_name, client_phone_no, vehicle_no, driver_name, price, date);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send("Error while adding ride: " + error)
    }
})



//Manager Routes
app.post('/register-manager', authenticateToken, async(req, res) => {
    const {role, user_id} = req.body;
    try {
        await UserModel.updateUser(role, user_id);
        res.status(201).send("Your Manager account created successfully with id: " + user_id);
    } catch (error) {
        res.status(400).send("Error while registering manager: " + error)
    }
})

app.post('/manager/add-ride', authenticateToken, async(req, res) => {
    const {client_name, duration, cost_per_day, total_kms} = req.body;

    try {
        const result = await RidesModel.addRides(client_name, duration, cost_per_day, total_kms);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send("Error while adding ride: " + error)
    }
})

app.post('/manager/add-initial-ride', authenticateToken, async(req, res) => {
    const {ride_id, start_date} = req.body;

    try {
        const result = await DailyLogsModel.addIntialLog(ride_id, start_date);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send("Error while adding initial ride: " + error)
    }
})

app.get('/manager/ride/:id', authenticateToken, async(req, res) => {
    const {id} = req.params;

    try {
        const result = await DailyLogsModel.getDailyLogsById(id);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting ride details: " + error)
    }
})

//Common Routes
app.get('/vendor-vehicles', authenticateToken, async(req, res) => {
    const {vehicle_no} = req.body;
    try {
        const result = await VehicleModel.getVendor(vehicle_no);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting vehicles: " + error)
    }
})

app.get('/get-rides', authenticateToken, async(req, res) => {
    try {
        const result = await RidesModel.getRides();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting rides: " + error)
    }
})

app.get('/get-ride/:id', authenticateToken, async(req, res) => {
    const {id} = req.params;
    try {
        const result = await RidesModel.getRideById(id);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting ride details: " + error)
    }
})

app.get('/ride-details/:ride_id/:start_date', authenticateToken, async (req, res) => {
    const { ride_id, start_date } = req.params;
    console.log(ride_id)
    console.log(start_date)
    try {
        const result = await DailyLogsModel.getRideDetails(ride_id, start_date);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting ride details: " + error);
    }
});

app.get('/get-user/:id', authenticateToken, async(req, res) => {
    const {id} = req.params;

    try {
        const result = await UserModel.getUserById(id);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting user: " + error)
    }
})

app.get('/get-daily-logs', async (req, res) => {
    try {
        const result = await DailyLogsModel.getLogs();
        res.status(200).send(result);
    } catch (error) {
        console.error("Error while getting daily logs:", error);
        res.status(400).send("Error while getting daily logs: " + error.message);
    }
});

app.get('/get-attendances', authenticateToken, async(req, res) => {
    try {
        const result = await AttendanceModel.getAttendances();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting attendaces: " + error)
    }
})

app.get('/get-vehicle-details/:id', authenticateToken, async(req,res) => {
    const {id} = req.params;
    try {
        const result = await VehicleModel.getVehicleDetails(id);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting vehicle type: " + error)
    }
})

app.get('/get-presents', authenticateToken, async(req, res) => {
    try {
        const result = await AttendanceModel.getPresents();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting presents: " + error)
    }
})

app.get('/get-absents', authenticateToken, async(req, res) => {
    try {
        const result = await AttendanceModel.getAbsents();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting absents: " + error)
    }
})

app.get('/get-daily-logs-by-date', authenticateToken, async(req, res) => {
    const {date} = req.query;
    try {
        const result = await DailyLogsModel.getDailyLogsByDate(date);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while getting daily logs by date: " + error)
    }
})

app.get('/get-vehicles-for-backup', authenticateToken, async(req, res) => {
    const {vehicle_type} = req.query
   try {
       const result = await VehicleModel.getVehiclesForBackup(vehicle_type);
       res.status(200).send(result);
   } catch (error) {
    res.status(400).send("Error while getting vehicles for backup: " + error)
   }
})

app.get('/partners', authenticateToken, async(req, res) => {
    const {query} = req.query;

    try{
        const result = await UserModel.getVendors(query);
        res.status(200).send(result)
    } catch(error){
        res.status(400).send("Error while searching vendors: " + error)
    }
})

app.get('/search-drivers', authenticateToken, async(req, res) => {
    const {query} = req.query;

    try {
        const result = await UserModel.getDrivers(query);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while searching drivers: " + error)
    }
})

app.get('/search-vehicles', authenticateToken, async(req, res) => {
    const {query} = req.query;

    try {
        const result = await VehicleModel.searchVehicles(query);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Error while searching vehicles: " + error)
    }
})

//Backup Routes
app.get('/get-backup-details/:ride_id/:date', authenticateToken, async(req, res) => {
    const {ride_id, date} = req.params;

    try {
        const result = await BackupModel.getBackupVehcileDetails(ride_id, date);
        res.status(200).send(result);
    } catch(error){
        res.status(400).send("Error while getting backup details: " + error);
    }
})

app.post('/add-backup', authenticateToken, upload.none(), async(req, res) => {
    const {ride_id, date, vehicle_no, driver_id} = req.body;
    console.log("Request Body:", req.body);
    try {
        const result = await BackupModel.addBackup(ride_id, date, vehicle_no, driver_id);
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send("Error while adding backup: " + error)
    }
})

//Initialize DB and Server
const initializeDBAndServer = async () => {
    try {
        await UserModel.createUsersTable();
        await DriverModel.createDriverTable();
        await VendorModel.createVendorTable();
        await VehicleModel.createVehicleTable();
        await MaintenanceModel.createMaintenanceTable();
        await RidesModel.createRidesModel();
        await DailyLogsModel.createDailyLogsTable();
        await AttendanceModel.createAttendanceTable();
        await BackupModel.createBackupTable();
        await AdHOCRidesModel.createAdHOCRidesTable();
        app.listen(port, () => {
            //startDailyJobLog();
            console.log(`Sever is running on http://localhost:${port}`)
        })
    } catch (error) {
        console.log("Error while intializing DB and Server: " + error)
    }
}

//startDailyJobLog();

initializeDBAndServer()