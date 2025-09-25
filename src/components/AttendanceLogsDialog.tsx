"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function AttendanceLogsDialog({
  showLogs,
  setShowLogs,
  selectedUser,
  logs,
  userMap,
  selectedDate,
  setSelectedDate,
}: any) {
  const filteredLogs = logs
    ? logs.filter((log: any) => {
        if (!selectedDate) return true;
        return new Date(log.timestamp).toDateString() === selectedDate.toDateString();
      })
    : [];

  return (
    <Dialog open={showLogs} onOpenChange={setShowLogs}>
      <DialogContent className="w-full max-w-full sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Attendance Logs for {selectedUser?.name}</DialogTitle>
        </DialogHeader>

        {/* Date Filter */}
        <div className="mt-2 mb-4 flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal bg-black text-white"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 bg-black rounded-lg shadow-lg"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={(date) => setSelectedDate(date ?? null)}
                required={false}
                initialFocus
                className="bg-black text-white [&_.rdp-day_selected]:bg-white [&_.rdp-day_selected]:text-black [&_.rdp-day:hover]:bg-gray-700"
              />
            </PopoverContent>
          </Popover>
          
          {selectedDate && (
            <Button
              variant="outline"
              onClick={() => setSelectedDate(null)}
              className="text-white hover:bg-gray-800"
            >
              Clear
            </Button>
          )}
        </div>


        {/* Logs Table */}
        <div className="flex-1 overflow-y-auto">
          {!logs ? (
            <p>Loading...</p>
          ) : filteredLogs.length === 0 ? (
            <p>No logs found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border max-h-[60vh]">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/30 top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                    <th className="px-4 py-2 text-left">Scanned By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log: any) => (
                    <tr key={log._id} className="border-t">
                      <td className="px-4 py-2 font-medium">
                        {log.type === "entry" ? (
                          <span className="text-green-600">Entry</span>
                        ) : (
                          <span className="text-red-600">Exit</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {log.scannedBy
                          ? userMap.get(log.scannedBy) ?? log.scannedBy
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
