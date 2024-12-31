import cron from "node-cron";
import VehicleModel from "../models/VehicleModel.js";
import DailyLogsModel from "../models/DailyLogsModel.js";
import RidesModel from "../models/RidesModel.js";
import DriverModel from "../models/DriverModel.js";

const startDailyJobLog = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const activeRides = await RidesModel.getActiveRides();
            if (activeRides.length === 0) {
                return console.log("No active rides");
            }
            for(const ride of activeRides){
                const lastLog = await DailyLogsModel.getLastLog(ride.id);
                console.log(lastLog)
                const vehicle = await VehicleModel.getVehicleStatus(lastLog.vehicle_no);
                const driver = await DriverModel.getDriverStatus(lastLog.driver_id);
                const vehicleType = await VehicleModel.getVehicleType(lastLog.vehicle_no);
                const licenseType = await DriverModel.getLicenseType(lastLog.driver_id);

                let assignedVehicle = vehicle.status === "available" ? vehicle : await VehicleModel.findAvailableVehicle(vehicleType);
                let assignedDriver = driver.status === "available" ? driver : await DriverModel.findAvailableDriver(licenseType);

                console.log(assignedVehicle, assignedDriver)

                if(lastLog.end_time !== null){
                    if(assignedVehicle && assignedDriver){
                        const newLog = {
                            ride_id: ride.id,
                            start_date: new Date(),
                            start_time: new Date(),
                            vehicle_no: assignedVehicle.vehicle_no || lastLog.vehicle_no,
                            driver_id: assignedDriver.user_id || lastLog.driver_id,
                            vendor_id: assignedVehicle.vendor_id || lastLog.vendor_id
                        };
    
                        await DailyLogsModel.addDailyLog(
                            newLog.ride_id,
                            newLog.start_date,
                            newLog.start_time,
                            newLog.vehicle_no,
                            newLog.driver_id,
                            newLog.vendor_id
                        )
    
                        await RidesModel.updateRemainingDays(ride.id);
                        console.log(`Daily Log added for ride: ${ride.id}`);
                    }
                    else{
                        console.log(`No available resources for ride: ${ride.id}`);
                    }
                }
            }
        } catch (error) {
            console.log("Error while updating daily logs: " + error);
            throw error
        }
    })
}

export default startDailyJobLog