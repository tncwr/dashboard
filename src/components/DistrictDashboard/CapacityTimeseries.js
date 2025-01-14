import React, { useMemo } from "react";
import useSWR from "swr";

import { careSummary } from "../../utils/api";
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPES_ORDERED,
} from "../../utils/constants";
import {
  dateString,
  getNDateAfter,
  processFacilities,
} from "../../utils/utils";
import TimeseriesBarChart from "../Chart/TimeseriesBarChart";
import TimeseriesLineChart from "../Chart/TimeseriesLineChart";
import NoData from "../NoData";

function CapacityTimeseries({ filterDistrict, filterFacilityTypes, dates }) {
  const { data } = useSWR(
    ["CapacityTimeseries", dates, filterDistrict.id],
    (url, dates, district) =>
      careSummary(
        "facility",
        dateString(dates[0]),
        dateString(getNDateAfter(dates[1], 1)),
        district
      )
  );
  const { empty, chartable, chartableOxygen, chartablePatient } =
    useMemo(() => {
      const filtered = processFacilities(data.results, filterFacilityTypes);
      const datewise = filtered.reduce((acc, cur) => {
        if (acc[cur.date]) {
          acc[cur.date].oxygen += cur.oxygenCapacity || 0;
          acc[cur.date].actualLivePatients += cur.actualLivePatients || 0;
          acc[cur.date].actualDischargedPatients +=
            cur.actualDischargedPatients || 0;
          Object.keys(AVAILABILITY_TYPES).forEach((k) => {
            acc[cur.date][k].used += cur.capacity[k]?.current_capacity || 0;
            acc[cur.date][k].total += cur.capacity[k]?.total_capacity || 0;
          });
          return acc;
        }
        const _t = {
          oxygen: cur.oxygenCapacity,
          actualLivePatients: cur.actualLivePatients,
          actualDischargedPatients: cur.actualDischargedPatients,
          20: { total: 0, used: 0 },
          10: { total: 0, used: 0 },
          150: { total: 0, used: 0 },
          1: { total: 0, used: 0 },
          25: { total: 0, used: 0 },
          15: { total: 0, used: 0 },
          155: { total: 0, used: 0 },
          5: { total: 0, used: 0 },
          70: { total: 0, used: 0 },
          50: { total: 0, used: 0 },
          60: { total: 0, used: 0 },
          40: { total: 0, used: 0 },
          75: { total: 0, used: 0 },
          55: { total: 0, used: 0 },
          65: { total: 0, used: 0 },
          45: { total: 0, used: 0 },
          100: { total: 0, used: 0 },
          110: { total: 0, used: 0 },
          120: { total: 0, used: 0 },
          30: { total: 0, used: 0 },
          2: { total: 0, used: 0 },
          12: { total: 0, used: 0 },
          22: { total: 0, used: 0 },
          32: { total: 0, used: 0 },
          3: { total: 0, used: 0 },
          13: { total: 0, used: 0 },
          23: { total: 0, used: 0 },
          33: { total: 0, used: 0 },
          111: { total: 0, used: 0 },
          112: { total: 0, used: 0 },
          113: { total: 0, used: 0 },
          114: { total: 0, used: 0 },
        };
        _t.oxygen += cur.oxygenCapacity;
        Object.keys(AVAILABILITY_TYPES).forEach((k) => {
          _t[k].used += cur.capacity[k]?.current_capacity || 0;
          _t[k].total += cur.capacity[k]?.total_capacity || 0;
        });
        return {
          ...acc,
          [cur.date]: _t,
        };
      }, {});
      const chartable = AVAILABILITY_TYPES_ORDERED.map((k) => ({
        name: AVAILABILITY_TYPES[k],
        data: Object.entries(datewise)
          .reverse()
          .map(([d, value]) => ({
            date: d,
            used: value[k].used,
            total: value[k].total,
          })),
      }));
      const chartableOxygen = {
        name: "Oxygen",
        data: Object.entries(datewise)
          .reverse()
          .map(([d, value]) => ({
            date: d,
            oxygen: value.oxygen,
          })),
      };
      const chartablePatient = {
        name: "Patients",
        data: Object.entries(datewise)
          .reverse()
          .map(([d, value]) => ({
            date: d,
            live: value.actualLivePatients,
            discharged: value.actualDischargedPatients,
          })),
      };
      return {
        empty: filtered.length === 0,
        chartable,
        chartableOxygen,
        chartablePatient,
      };
    }, [data, filterFacilityTypes]);

  return (
    <div className="min-w-full min-h-full">
      {empty ? (
        <>
          {chartable.map((s, i) => (
            <TimeseriesBarChart
              key={i}
              name={s.name}
              data={s.data}
              dataKeys={["used", "total"]}
              colors={["var(--color-primary-400)", "var(--color-primary-500)"]}
            />
          ))}
          <TimeseriesLineChart
            name={chartableOxygen.name}
            data={chartableOxygen.data}
            dataKeys={["oxygen"]}
            colors={["var(--color-primary-500)"]}
          />
          <TimeseriesLineChart
            name={chartablePatient.name}
            data={chartablePatient.data}
            dataKeys={["live", "discharged"]}
            colors={["var(--color-primary-500)", "var(--color-primary-400)"]}
          />
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default CapacityTimeseries;
