import React, { useState } from "react";
import "./AdminHomePage.css";
// import { db, storage } from "../firebase"; // Uncomment and adjust as needed

const AdminHomePage = () => {
  // ... existing code ...
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [recentBlogs, setRecentBlogs] = useState([{ title: "", link: "" }]);
  const [universityAdmissions, setUniversityAdmissions] = useState([
    { title: "", link: "" },
  ]);
  const [videoTutorials, setVideoTutorials] = useState([
    { title: "", link: "" },
  ]);
  const [educationalServices, setEducationalServices] = useState([
    { title: "", link: "" },
  ]);
  const [visionMission, setVisionMission] = useState("");
  const [footerContent, setFooterContent] = useState("");
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setHeroImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleAdd = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    newItem: any
  ) => {
    setter((prev) => [...prev, newItem]);
  };
  const handleRemove = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };
  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    index: number,
    field: string,
    value: string
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save hero image to storage and get URL
      let heroImageUrl = "";
      if (heroImage) {
        // Uncomment and adjust as needed
        // const storageRef = ref(storage, `hero-images/${Date.now()}-${heroImage.name}`);
        // await uploadBytes(storageRef, heroImage);
        // heroImageUrl = await getDownloadURL(storageRef);
      }

      // Prepare data to save
      const dataToSave = {
        heroImage: heroImageUrl,
        recentBlogs,
        universityAdmissions,
        videoTutorials,
        educationalServices,
        visionMission,
        footerContent,
      };

      // Save data to database
      // Uncomment and adjust as needed
      // await setDoc(doc(db, "homepage", "content"), dataToSave);

      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="admin-homepage-container">
      <h2 className="admin-title">Home Page CMS</h2>

      {/* Hero Image/Banner */}
      <section className="admin-section">
        <h3 className="admin-section-title">Hero Image/Banner</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleHeroImageChange}
          className="admin-input-file"
        />
        {heroImagePreview && (
          <div className="admin-image-preview-wrapper">
            <img
              src={heroImagePreview}
              alt="Hero Preview"
              className="admin-image-preview"
            />
          </div>
        )}
      </section>

      {/* Recent Blogs */}
      <section className="admin-section">
        <h3 className="admin-section-title">Recent Blogs</h3>
        {recentBlogs.map((blog, i) => (
          <div key={i} className="admin-row">
            <input
              type="text"
              placeholder="Blog Title"
              value={blog.title}
              onChange={(e) =>
                handleChange(setRecentBlogs, i, "title", e.target.value)
              }
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Blog Link"
              value={blog.link}
              onChange={(e) =>
                handleChange(setRecentBlogs, i, "link", e.target.value)
              }
              className="admin-input"
            />
            <button
              className="admin-btn admin-btn-danger"
              onClick={() => handleRemove(setRecentBlogs, i)}
              disabled={recentBlogs.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="admin-btn admin-btn-secondary"
          onClick={() => handleAdd(setRecentBlogs, { title: "", link: "" })}
        >
          Add Blog
        </button>
      </section>

      {/* University Admissions */}
      <section className="admin-section">
        <h3 className="admin-section-title">University Admissions</h3>
        {universityAdmissions.map((item, i) => (
          <div key={i} className="admin-row">
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleChange(
                  setUniversityAdmissions,
                  i,
                  "title",
                  e.target.value
                )
              }
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Link"
              value={item.link}
              onChange={(e) =>
                handleChange(setUniversityAdmissions, i, "link", e.target.value)
              }
              className="admin-input"
            />
            <button
              className="admin-btn admin-btn-danger"
              onClick={() => handleRemove(setUniversityAdmissions, i)}
              disabled={universityAdmissions.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="admin-btn admin-btn-secondary"
          onClick={() =>
            handleAdd(setUniversityAdmissions, { title: "", link: "" })
          }
        >
          Add Admission
        </button>
      </section>

      {/* Video Tutorials */}
      <section className="admin-section">
        <h3 className="admin-section-title">Video Tutorials</h3>
        {videoTutorials.map((item, i) => (
          <div key={i} className="admin-row">
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleChange(setVideoTutorials, i, "title", e.target.value)
              }
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Link"
              value={item.link}
              onChange={(e) =>
                handleChange(setVideoTutorials, i, "link", e.target.value)
              }
              className="admin-input"
            />
            <button
              className="admin-btn admin-btn-danger"
              onClick={() => handleRemove(setVideoTutorials, i)}
              disabled={videoTutorials.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="admin-btn admin-btn-secondary"
          onClick={() => handleAdd(setVideoTutorials, { title: "", link: "" })}
        >
          Add Video
        </button>
      </section>

      {/* Educational Services */}
      <section className="admin-section">
        <h3 className="admin-section-title">Educational Services</h3>
        {educationalServices.map((item, i) => (
          <div key={i} className="admin-row">
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleChange(setEducationalServices, i, "title", e.target.value)
              }
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Link"
              value={item.link}
              onChange={(e) =>
                handleChange(setEducationalServices, i, "link", e.target.value)
              }
              className="admin-input"
            />
            <button
              className="admin-btn admin-btn-danger"
              onClick={() => handleRemove(setEducationalServices, i)}
              disabled={educationalServices.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          className="admin-btn admin-btn-secondary"
          onClick={() =>
            handleAdd(setEducationalServices, { title: "", link: "" })
          }
        >
          Add Service
        </button>
      </section>

      {/* Vision & Mission */}
      <section className="admin-section">
        <h3 className="admin-section-title">Vision & Mission</h3>
        <textarea
          rows={3}
          className="admin-textarea"
          placeholder="Enter vision and mission statement"
          value={visionMission}
          onChange={(e) => setVisionMission(e.target.value)}
        />
      </section>

      {/* Footer Content */}
      <section className="admin-section">
        <h3 className="admin-section-title">Footer Content</h3>
        <textarea
          rows={3}
          className="admin-textarea"
          placeholder="Enter footer content"
          value={footerContent}
          onChange={(e) => setFooterContent(e.target.value)}
        />
      </section>

      <button
        className="admin-btn admin-btn-primary admin-save-btn"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
};

export default AdminHomePage;
