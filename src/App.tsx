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

// Define the Prayer type
interface Prayer {
  id: string;
  time: string | number;
  name: string; // Add this line if 'name' exists in your Firestore documents
}

const prayerOrder = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"];


// Translation dictionary
const translations = {
  title: {
    en: "Al Hasan Masjid",
    ur: "ال حسن مسجد",
  },
  prayerTimes: {
    en: "Prayer Times",
    ur: "نماز کے اوقات",
  },
  announcements: {
    en: "Announcements",
    ur: "اعلانات",
  },
  donate: {
    en: "Donate",
    ur: "مسجد کا چندہ",
  },
  donateButton: {
    en: "Donate Now",
    ur: "اب عطیہ کریں",
  },
  adminPanel: {
    en: "Admin Panel",
    ur: "ایڈمن پینل",
  },
  incorrectPassword: {
    en: "Incorrect password!",
    ur: "غلط پاس ورڈ!",
  },
  saveChanges: {
    en: "Save Changes",
    ur: "تبدیلیاں محفوظ کریں",
  },
  savedMessage: {
    en: "Changes saved!",
    ur: "تبدیلیاں محفوظ کر لی گئیں!",
  },
  adminLogin: {
    en: "Admin Login",
    ur: "ایڈمن لاگ ان",
  },
};


const AlHasanMasjid = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
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
      time: doc.data().time,
      name: doc.data().name, // Make sure 'name' is fetched from Firestore
      ...doc.data(),
    }));
    // Sort prayers based on the defined order
    prayersList.sort((a, b) => prayerOrder.indexOf(a.name) - prayerOrder.indexOf(b.name));
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

  const handleAnnouncementChange = (newAnnouncement: string) => {
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

  const updatePrayerTime = async (id: string, newTime?: string | number) => {
    const prayerDoc = doc(db, "prayers", id);
    try {
      if (newTime !== undefined) {
        await updateDoc(prayerDoc, { time: newTime });
        console.log("Prayer time updated successfully.");
      } else {
        console.log("No time provided for prayer with id:", id);
      }
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
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
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
    if (password === "alhasan123") {
      setIsAdmin(true);
      setIncorrectPassword(false);
    } else {
      setIncorrectPassword(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded shadow-md bg-opacity-80 backdrop-filter backdrop-blur-md">
      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
      {translations.title.en} <br /> {translations.title.ur}
      </h1>
      <div className="flex flex-wrap justify-center mb-6">
        {/* Tab Buttons */}
        <button
          className={`text-lg font-bold p-3 rounded m-1 transition-all duration-300 ${
            activeTab === "prayer-times"
              ? "bg-blue-100 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-blue-300"
          }`}
          onClick={() => setActiveTab("prayer-times")}
        >
          {translations.prayerTimes.en} <br /> {translations.prayerTimes.ur}
        </button>
        <button
          className={`text-lg font-bold p-3 rounded m-1 transition-all duration-300 ${
            activeTab === "donate"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-blue-300"
          }`}
          onClick={() => setActiveTab("donate")}
        >
          {translations.donate.en} <br /> {translations.donate.ur}
        </button>
        <button
          className={`text-lg font-bold p-3 rounded m-1 transition-all duration-300 ${
            activeTab === "admin"
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-blue-300"
          }`}
          onClick={() => setActiveTab("admin")}
        >
          {translations.adminPanel.en} <br /> {translations.adminPanel.ur}
        </button>
      </div>
      {activeTab === "prayer-times" && (
  <div className="mb-4">
    {/* Added className "prayer-times-heading" */}
    <h2 className="prayer-times-heading">{translations.prayerTimes.en} {translations.prayerTimes.ur}</h2>
          <ul className="prayer-times">
          {prayers.map((prayer) => (
            <li key={prayer.id}>
              
              {/* Added className "prayer-name" for name */}
              <span className="prayer-name">{prayer.name}</span> 
              
              {/* Added className "prayer-time" for time */}
              <span className="prayer-time">{prayer.time}</span>
          </li>
        ))}
          </ul>
                      {/* Updated the className for Announcements heading */}
    <h3 className="announcements-heading">{translations.announcements.en} <br /> {translations.announcements.ur}</h3>

          {isAdmin ? (
            <textarea
              value={announcement}
              onChange={(e) => handleAnnouncementChange(e.target.value)}
              className="text-lg p-2 border border-gray-300 rounded-lg w-full h-24 bg-gray-100 shadow-inner"
            />
          ) : (
            <textarea
              value={announcement}
              readOnly
              className="text-lg p-2 border border-gray-300 rounded-lg w-full h-24 bg-gray-100 shadow-inner"
            />
          )}
        </div>
      )}
      {activeTab === "donate" && (
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Donate to Al Hasan Masjid
          </h2>
          <p className="text-lg text-gray-800 mb-4">
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
              {translations.prayerTimes.en}<br></br>{translations.prayerTimes.ur}
              </h3>
              <ul>
                {prayers.map((prayer) => (
                  <li
                    key={prayer.id}
                    className="flex justify-between p-2 border-b border-gray-200"
                  >
                    <span className="text-2xl font-bold admin-input">{prayer.name}</span>
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
                    className="text-lg p-2 border border-gray-200 admin-input"
                  />
                  </li>
                ))}
              </ul>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                {translations.announcements.en}<br></br>{translations.announcements.ur}
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
                <p className="text-green-600 mt-2">Changes saved!</p>
              )}
            </div>
          ) : (
            <div className="admin-login"> {/* Added className here */}
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
