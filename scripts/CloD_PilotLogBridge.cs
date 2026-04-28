// Hotseat Pilot Log Bridge for IL-2 Sturmovik: Cliffs of Dover / Blitz
// Prototype mission script.
//
// Intended use:
// 1. Merge the relevant methods into a mission .cs file, or include this as the mission script.
// 2. Start the mission.
// 3. The script writes JSON Lines to:
//      Documents\1C SoftClub\il-2 sturmovik cliffs of dover\HotseatPilotLog\events.jsonl
// 4. The local companion bridge can read the latest event and use it to pre-fill the Pilot's Log.
//
// Notes:
// - This is deliberately conservative: it records events using known AMission callbacks.
// - You may need to adapt object naming / player identification to match the exact Lenny mission script structure.

using System;
using System.IO;
using maddox.game;
using maddox.game.world;
using part;

public class Mission : AMission
{
    private string _logDir;
    private string _logFile;

    public override void Init(maddox.game.ABattle battle, int missionNumber)
    {
        base.Init(battle, missionNumber);

        // Listen to all mission events, including spawned/sub-mission aircraft.
        MissionNumberListener = -1;

        string docs = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        _logDir = Path.Combine(docs, "1C SoftClub", "il-2 sturmovik cliffs of dover", "HotseatPilotLog");
        _logFile = Path.Combine(_logDir, "events.jsonl");

        Directory.CreateDirectory(_logDir);
        WriteEvent("script_init", "", "", "", "Pilot log bridge initialised");
    }

    public override void OnBattleStarted()
    {
        base.OnBattleStarted();
        MissionNumberListener = -1;
        WriteEvent("battle_started", "", "", "", "Battle started");
    }

    public override void OnBattleStoped()
    {
        base.OnBattleStoped();
        WriteEvent("battle_stopped", "", "", "", "Battle stopped");
    }

    public override void OnPlaceEnter(Player player, AiActor actor, int placeIndex)
    {
        base.OnPlaceEnter(player, actor, placeIndex);
        WriteEvent("place_enter", ActorName(actor), "", "", "Player entered aircraft place " + placeIndex);
    }

    public override void OnPlaceLeave(Player player, AiActor actor, int placeIndex)
    {
        base.OnPlaceLeave(player, actor, placeIndex);
        WriteEvent("place_leave", ActorName(actor), "", "", "Player left aircraft place " + placeIndex);
    }

    public override void OnAircraftTookOff(int missionNumber, string shortName, AiAircraft aircraft)
    {
        base.OnAircraftTookOff(missionNumber, shortName, aircraft);
        WriteEvent("takeoff", shortName, AircraftName(aircraft), "", "Aircraft took off");
    }

    public override void OnAircraftLanded(int missionNumber, string shortName, AiAircraft aircraft)
    {
        base.OnAircraftLanded(missionNumber, shortName, aircraft);
        WriteEvent("landed", shortName, AircraftName(aircraft), "", "Aircraft landed");
    }

    public override void OnAircraftKilled(int missionNumber, string shortName, AiAircraft aircraft)
    {
        base.OnAircraftKilled(missionNumber, shortName, aircraft);
        WriteEvent("aircraft_killed", shortName, AircraftName(aircraft), "", "Aircraft destroyed");
    }

    public override void OnAircraftDamaged(int missionNumber, string shortName, AiAircraft aircraft, AiDamageInitiator initiator, NamedDamageTypes damageType)
    {
        base.OnAircraftDamaged(missionNumber, shortName, aircraft, initiator, damageType);
        WriteEvent("aircraft_damaged", shortName, AircraftName(aircraft), Safe(initiator), "Damage: " + Safe(damageType));
    }

    private string ActorName(AiActor actor)
    {
        return actor == null ? "" : actor.ToString();
    }

    private string AircraftName(AiAircraft aircraft)
    {
        return aircraft == null ? "" : aircraft.ToString();
    }

    private string Safe(object value)
    {
        return value == null ? "" : value.ToString().Replace("\\", "\\\\").Replace("\"", "\\\"");
    }

    private void WriteEvent(string eventType, string shortName, string aircraft, string initiator, string notes)
    {
        try
        {
            string json =
                "{" +
                "\"timestampUtc\":\"" + DateTime.UtcNow.ToString("o") + "\"," +
                "\"eventType\":\"" + Safe(eventType) + "\"," +
                "\"shortName\":\"" + Safe(shortName) + "\"," +
                "\"aircraft\":\"" + Safe(aircraft) + "\"," +
                "\"initiator\":\"" + Safe(initiator) + "\"," +
                "\"notes\":\"" + Safe(notes) + "\"" +
                "}";

            File.AppendAllText(_logFile, json + Environment.NewLine);
        }
        catch
        {
            // Avoid breaking the mission if logging fails.
        }
    }
}
