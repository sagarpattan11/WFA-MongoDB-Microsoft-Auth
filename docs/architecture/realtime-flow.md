# Real-Time Event Architecture Specification

## 1. Overview

The Workforce Analytics Platform uses **Socket.IO** for low-latency bidirectional communication between the server and active client sessions.

```mermaid
graph LR
    subgraph Clients [Active Web Clients]
        AdminClient[Admin Dashboard]
        ManagerClient[Manager Roster View]
        EmployeeClient[Employee Portal]
    end

    subgraph SocketServer [Socket.IO Server Engine]
        ConnectionMgr[Connection & Auth Validator]
        RoomRouter[Room & Channel Router]
    end

    subgraph EventEmitters [Backend Event Sources]
        AttendanceEvent[Attendance Check-in Event]
        ShiftSwapEvent[Shift Swap Request Event]
        AlertEvent[Compliance Violation Alert]
    end

    AdminClient <-->|WSS Auth Handshake| ConnectionMgr
    ManagerClient <-->|WSS Auth Handshake| ConnectionMgr
    EmployeeClient <-->|WSS Auth Handshake| ConnectionMgr

    ConnectionMgr --> RoomRouter
    
    AttendanceEvent --> RoomRouter
    ShiftSwapEvent --> RoomRouter
    AlertEvent --> RoomRouter

    RoomRouter -->|Broadcast to 'dept:engineering'| ManagerClient
    RoomRouter -->|Broadcast to 'admin:compliance'| AdminClient
    RoomRouter -->|Broadcast to 'user:emp123'| EmployeeClient
```

---

## 2. Channel & Room Segmentation

| Room Pattern | Audience | Event Types |
| :--- | :--- | :--- |
| `global:system` | All connected enterprise clients | Maintenance alerts, system announcements |
| `role:admin` | System administrators | Critical compliance breaches, audit log alerts |
| `role:hr` | HR managers and staff | New onboardings, leave approvals pending |
| `dept:{departmentId}` | Department managers and team leads | Department attendance updates, shift rosters |
| `user:{userId}` | Targeted individual user | Shift swap approvals, direct notifications |

---

## 3. Standard Event Schemas

All real-time Socket payloads adhere to standard typed interfaces:

```typescript
interface SocketMessagePayload<T = unknown> {
  eventId: string;
  eventType: 'ATTENDANCE_UPDATE' | 'SHIFT_CHANGE' | 'COMPLIANCE_ALERT' | 'NOTIFICATION';
  timestamp: string;
  source: string;
  data: T;
}
```
