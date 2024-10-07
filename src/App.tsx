import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

const AlHasanMasjid = () => {
  const [prayers, setPrayers] = useState([]);
  const [activeTab, setActiveTab] = useState("prayer-times");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [announcement, setAnnouncement] = useState(" ");
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // Fetch prayers from Firestore
  const fetchPrayers = async () => {
    const prayersCollection = collection(db, "prayers");
    const prayersSnapshot = await getDocs(prayersCollection);
    const prayersList = prayersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPrayers(prayersList);
  };

  // Fetch announcement from Firestore
  const fetchAnnouncement = async () => {
    const announcementDoc = doc(db, "announcements", "announce");
    const docSnap = await getDoc(announcementDoc);
    if (docSnap.exists()) {
      setAnnouncement(docSnap.data().text);
    } else {
      console.log("No such document!");
    }
  };

  // Handle announcement change
  const handleAnnouncementChange = (newAnnouncement) => {
    setAnnouncement(newAnnouncement);
    setChangesMade(true);
  };

  // Save changes for announcement
  const saveAnnouncementChanges = async () => {
    const announcementDoc = doc(db, "announcements", "announce");
    try {
      await updateDoc(announcementDoc, { text: announcement });
      console.log("Announcement updated successfully.");
    } catch (error) {
      console.error("Error updating announcement: ", error);
    }
  };

  // Update prayer time
  const updatePrayerTime = async (id, newTime) => {
    const prayerDoc = doc(db, "prayers", id);
    try {
      await updateDoc(prayerDoc, { time: newTime });
      console.log("Prayer time updated successfully.");
      setChangesMade(true);
    } catch (error) {
      console.error("Error updating prayer time: ", error);
    }
  };

  // Save all prayer time changes
  const savePrayerChanges = async () => {
    prayers.forEach(async (prayer) => {
      await updatePrayerTime(prayer.id, prayer.time);
    });
  };

  // Save all changes (prayers and announcement)
  const saveAllChanges = () => {
    savePrayerChanges();
    saveAnnouncementChanges();
    setShowSaveMessage(true);
    setChangesMade(false);
  };

  useEffect(() => {
    fetchPrayers();
    fetchAnnouncement();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (changesMade) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [changesMade]);

  const handleAdminLogin = () => {
    if (password === "admin123") {
      setIsAdmin(true);
      setIncorrectPassword(false);
    } else {
      setIncorrectPassword(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded shadow-md bg-opacity-80 backdrop-filter backdrop-blur-md">
      <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">
        Al Hasan Masjid
      </h1>
      <div className="flex flex-wrap justify-center mb-4">
        {/* Tab Buttons */}
        <button
          className={`text-lg font-bold p-3 rounded m-1 transition-all duration-300 ${
            activeTab === "prayer-times"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-blue-300"
          }`}
          onClick={() => setActiveTab("prayer-times")}
        >
          Prayer Times
        </button>
        <button
          className={`text-lg font-bold p-3 rounded m-1 transition-all duration-300 ${
            activeTab === "donate"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-blue-300"
          }`}
          onClick={() => setActiveTab("donate")}
        >
          Donate
        </button>
        <button
          className={`text-lg font-bold p-3 rounded m-1 transition-all duration-300 ${
            activeTab === "admin"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-blue-300"
          }`}
          onClick={() => setActiveTab("admin")}
        >
          Admin
        </button>
      </div>
      {activeTab === "prayer-times" && (
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Prayer Times
          </h2>
          <ul>
            {prayers.map((prayer) => (
              <li
                key={prayer.id}
                className="flex justify-between p-2 border-b border-gray-200"
              >
                <span className="text-lg font-bold text-blue-600">
                  {prayer.name}
                </span>
                <span className="text-lg">{prayer.time}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Announcements
          </h3>
          <textarea
            value={announcement}
            onChange={(e) => handleAnnouncementChange(e.target.value)}
            className="text-lg p-2 border border-gray-200 w-full h-24"
          />
        </div>
      )}
      {activeTab === "donate" && (
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Donate to Al Hasan Masjid
          </h2>
          <p className="text-lg text-gray-800">
            Please consider donating to support our community.
          </p>
          <button className="text-lg font-bold p-3 rounded bg-blue-500 text-white shadow-md hover:bg-blue-600">
            Donate Now
          </button>
        </div>
      )}
      {activeTab === "admin" && (
        <div className="mb-4">
          {isAdmin ? (
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">
                Admin Panel
              </h2>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                Prayer Times
              </h3>
              <ul>
                {prayers.map((prayer) => (
                  <li
                    key={prayer.id}
                    className="flex justify-between p-2 border-b border-gray-200"
                  >
                    <span className="text-lg font-bold">{prayer.name}</span>
                    <input
                      type="text"
                      value={prayer.time}
                      onChange={(e) => {
                        const newTime = e.target.value;
                        const newPrayers = prayers.map((p) =>
                          p.id === prayer.id ? { ...p, time: newTime } : p
                        );
                        setPrayers(newPrayers);
                        setChangesMade(true);
                      }}
                      className="text-lg p-2 border border-gray-200"
                    />
                  </li>
                ))}
              </ul>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Announcement
              </h3>
              <textarea
                value={announcement}
                onChange={(e) => handleAnnouncementChange(e.target.value)}
                className="text-lg p-2 border border-gray-200 w-full h-24"
              />
              <button
                className="mt-4 p-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
                onClick={saveAllChanges}
              >
                Save Changes
              </button>
              {showSaveMessage && (
                <p className="text-green-600 mt-2">
                  Changes saved successfully!
                </p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">
                Admin Login
              </h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-lg p-2 border border-gray-200 w-full"
                placeholder="Enter password"
              />
              <button
                className="text-lg font-bold p-3 rounded bg-blue-500 text-white shadow-md hover:bg-blue-600 mt-2"
                onClick={handleAdminLogin}
              >
                Login
              </button>
              {incorrectPassword && (
                <p className="text-red-600 mt-2">Incorrect password!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlHasanMasjid;
