import { Alert } from "@mui/material";

export function AlertMsg({ alert }) {
    return (
        <Alert className="alert-msg" severity={alert.severity} >
            {alert.text}
        </Alert>
    )
}
