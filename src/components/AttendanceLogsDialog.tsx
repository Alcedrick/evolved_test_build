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
      <DialogContent className="w-full max-w-full sm:max-w-2xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-800 text-gray-100 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-100">
            Attendance Logs for {selectedUser?.name}
          </DialogTitle>
        </DialogHeader>

        {/* Date Filter */}
        <div className="mt-2 mb-4 flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal bg-neutral-800 border border-neutral-700 text-gray-100 hover:border-red-500 hover:text-neutral-50 focus-visible:ring-1 focus-visible:ring-red-500"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={(date) => setSelectedDate(date ?? null)}
                initialFocus
                className="bg-neutral-900 text-gray-100 
                           [&_.rdp-day_selected]:bg-red-600 
                           [&_.rdp-day_selected]:text-white 
                           [&_.rdp-day:hover]:bg-neutral-700"
              />
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <Button
              variant="outline"
              onClick={() => setSelectedDate(null)}
              className="text-gray-200 hover:border-red-500 hover:text-neutral-50"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-y-auto">
          {!logs ? (
            <p className="text-gray-400">Loading...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-gray-400">No logs found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-800 max-h-[60vh]">
              <table className="min-w-full text-sm text-gray-200">
                <thead className="bg-neutral-800 text-gray-300 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">Timestamp</th>
                    <th className="px-4 py-2 text-left font-medium">Scanned By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log: any) => (
                    <tr
                      key={log._id}
                      className="border-t border-neutral-800 bg-neutral-950 hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium">
                        {log.type === "entry" ? (
                          <span className="text-green-500">Entry</span>
                        ) : (
                          <span className="text-red-500">Exit</span>
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
