import useSWR from "swr";
import styles from "./status.module.css"; // Import CSS module

async function fetchAPI(key) {
  const response = await fetch(key);
  const status = await response.json();
  return status;
}

export default function StatusPage() {
  return (
    <div className={styles.terminal}>
      <div className={styles.screen}>
        <div className={styles.header}>
          ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM -Server 6-
          <br />
          COPYRIGHT 2075-2077 ROBCO INDUSTRIES
        </div>
        <div className={styles.subheader}>
          -RobCo Trespasser Management System-
        </div>
        <div className={styles.robcos}>
          RobcOS v.85
          <br />
          (C)2076 RobCo
        </div>
        <div className={styles.content}>
          <div className={styles.userLog}>
            User Log:
            <br />
            <UpdatedAt />
          </div>
          <DatabaseStatus /> {/* Include DatabaseStatus component */}
        </div>
      </div>
    </div>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 1000,
  });
  let updatedAtText = ">> Loading...";

  if (!isLoading && data) {
    updatedAtText = `>> Updated at: ${new Date(data.updated_at).toLocaleString("pt-BR")}`;
  }

  return <div>{updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Loading...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Version: {data.dependencies.database.version}</div>
        <div>
          Open Connections: {data.dependencies.database.opened_connections}
        </div>
        <div>Max Connections: {data.dependencies.database.max_connections}</div>
      </>
    );
  }

  return (
    <div className={styles.databaseStatus}>
      {" "}
      {/* Add a class for styling */}
      Database
      {databaseStatusInformation}
    </div>
  );
}
