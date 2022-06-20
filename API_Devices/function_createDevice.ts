import { TYPES } from "tedious";
import { Respond } from "../Utils/HttpUtils";
import { parseBody } from "../Utils/UserInput";
import { Procedure } from "../Types/Procedure.type";
import { runProcedure } from "../Utils/DatabaseConnection";
import { generatePasswordHash } from "../Utils/Encryption";

export default async (request, context) => {
  try {
    const orgId = "69674F3B-7652-4CDC-9592-E127FFC5ADBF";
    const hospitalId = "19E254EC-D65D-43EF-91E0-FE66D5B36878";
    const authorId = "4AA38157-9B07-4102-846E-C2F04E6B6924";
    const password = "NewPassword@123";

    const params: { serialNumber; deviceName; fdaId; deviceTypeId; manufacturerId; modelNumber; firmwareId; gatewayId; ipAddress; macAddress; port } =
      parseBody(request.body, [
        "serialNumber",
        "deviceName",
        "fdaId",
        "deviceTypeId",
        "manufacturerId",
        "modelNumber",
        "firmwareId",
        "gatewayId",
        "ipAddress",
        "macAddress",
        "port",
      ]);
    const { serialNumber, deviceName, fdaId, deviceTypeId, manufacturerId, modelNumber, firmwareId, gatewayId, ipAddress, macAddress, port } = params;

    const parameters: Array<{ name: string; value: string; type: TYPES }> = [];

    parameters.push({ name: "device_serial_no", value: serialNumber, type: TYPES.UniqueIdentifier });
    parameters.push({ name: "device_name", value: deviceName, type: TYPES.NVarChar });
    parameters.push({ name: "fda_device_id", value: fdaId, type: TYPES.NVarChar });
    parameters.push({ name: "device_type_id", value: deviceTypeId, type: TYPES.NVarChar });
    parameters.push({ name: "manufacturer_id", value: manufacturerId, type: TYPES.NVarChar });
    parameters.push({ name: "model_no", value: modelNumber, type: TYPES.UniqueIdentifier });
    parameters.push({ name: "firmware_id", value: firmwareId, type: TYPES.UniqueIdentifier });
    parameters.push({ name: "gateway_main_guid", value: gatewayId, type: TYPES.NVarChar });

    parameters.push({ name: "LocalMacid ", value: macAddress, type: TYPES.NVarChar });
    parameters.push({ name: "DeviceType ", value: deviceTypeId, type: TYPES.NVarChar });
    parameters.push({ name: "Ipadd ", value: ipAddress, type: TYPES.NVarChar });
    parameters.push({ name: "Port ", value: port, type: TYPES.NVarChar });

    const response = await runProcedure(Procedure._CREATE_DEVICE, parameters);
    console.log("Response from Database", response);
    Respond(context)._201("User created successfully");
  } catch (error) {
    context.log.error("################### ERROR IN API_NEW_DEVICE ################");
    const message = error.message;
    context.log.error("Error message from database: ", message);
    context.log.error("##########################################################");
    Respond(context)._500("There was a problem with this service execution", message);
  }
};
