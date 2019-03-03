(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function(schemaCallback) {
        
        // Define station status schema
        var station_status_cols = [{
            id: "station_id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "num_bikes_available",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "num_ebikes_available",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "num_bikes_disabled",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "num_docks_available",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "num_docks_disabled",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "is_installed",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "is_renting",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "is_returning",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "last_reported",
            dataType: tableau.dataTypeEnum.float
        }];

        var StationStatusTable = {
            id: "station_status",
            alias: "Station Status",
            columns: station_status_cols
        };

        var station_info_cols = [{
            id: "station_id",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "lat",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "lon",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "region_id",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "capacity",
            dataType: tableau.dataTypeEnum.float
        }];

        var StationInfoTable = {
            id: "station_information",
            alias: "Station Info",
            columns: station_info_cols
        };

        schemaCallback([StationStatusTable, StationInfoTable]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://gbfs.citibikenyc.com/gbfs/en/" + table.tableInfo.id + ".json", function(resp) {
            var stations = resp.data.stations,
                tableData = [];

            var i = 0;

            if (table.tableInfo.id == "station_status") {
                for (var i = 0, len = stations.length; i < len; i++) {
                    tableData.push({
                        "station_id": stations[i].station_id,
                        "num_bikes_available": stations[i].num_bikes_available,
                        "num_ebikes_available": stations[i].num_ebikes_available,
                        "num_bikes_disabled": stations[i].num_bikes_disabled,
                        "num_docks_available": stations[i].num_docks_available,
                        "num_docks_disabled": stations[i].num_docks_disabled,
                        "is_installed": stations[i].is_installed,
                        "is_renting": stations[i].is_renting,
                        "is_returning": stations[i].is_returning,
                        "last_reported": stations[i].last_reported
                    });
                }
            }   

            if (table.tableInfo.id == "station_information") {
                for (var i = 0, len = stations.length; i < len; i++) {
                    tableData.push({
                        "station_id": stations[i].station_id,
                        "name": stations[i].name,
                        "lat": stations[i].lat,
                        "lon": stations[i].lon,
                        "region_id": stations[i].region_id,
                        "capacity": stations[i].capacity
                    });
                }
            }   

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Citi Bike Station Status"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
