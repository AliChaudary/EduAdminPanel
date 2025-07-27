import React, { useState } from "react";
import "./AdminHomePage.css";
// import { db, storage } from "../firebase"; // Uncomment and adjust as needed

const AdminHomePage = () => {
  // ... existing code ...
  return (
    <div className="admin-homepage-container">
      <h2 className="admin-title">Home Page CMS</h2>

      {/* Hero Image/Banner */}
      <section className="admin-section">
        <h3 className="admin-section-title">Hero Image/Banner</h3>
        <input type="file" accept="image/*" onChange={handleHeroImageChange} className="admin-input-file" />
        {heroImagePreview && (
          <div className="admin-image-preview-wrapper">
            <img src={heroImagePreview} alt="Hero Preview" className="admin-image-preview" />
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
              onChange={e => handleChange(setRecentBlogs, i, "title", e.target.value)}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Blog Link"
              value={blog.link}
              onChange={e => handleChange(setRecentBlogs, i, "link", e.target.value)}
              className="admin-input"
            />
            <button className="admin-btn admin-btn-danger" onClick={() => handleRemove(setRecentBlogs, i)} disabled={recentBlogs.length <= 1}>Remove</button>
          </div>
        ))}
        <button className="admin-btn admin-btn-secondary" onClick={() => handleAdd(setRecentBlogs, { title: "", link: "" })}>Add Blog</button>
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
              onChange={e => handleChange(setUniversityAdmissions, i, "title", e.target.value)}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Link"
              value={item.link}
              onChange={e => handleChange(setUniversityAdmissions, i, "link", e.target.value)}
              className="admin-input"
            />
            <button className="admin-btn admin-btn-danger" onClick={() => handleRemove(setUniversityAdmissions, i)} disabled={universityAdmissions.length <= 1}>Remove</button>
          </div>
        ))}
        <button className="admin-btn admin-btn-secondary" onClick={() => handleAdd(setUniversityAdmissions, { title: "", link: "" })}>Add Admission</button>
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
              onChange={e => handleChange(setVideoTutorials, i, "title", e.target.value)}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Link"
              value={item.link}
              onChange={e => handleChange(setVideoTutorials, i, "link", e.target.value)}
              className="admin-input"
            />
            <button className="admin-btn admin-btn-danger" onClick={() => handleRemove(setVideoTutorials, i)} disabled={videoTutorials.length <= 1}>Remove</button>
          </div>
        ))}
        <button className="admin-btn admin-btn-secondary" onClick={() => handleAdd(setVideoTutorials, { title: "", link: "" })}>Add Video</button>
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
              onChange={e => handleChange(setEducationalServices, i, "title", e.target.value)}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Link"
              value={item.link}
              onChange={e => handleChange(setEducationalServices, i, "link", e.target.value)}
              className="admin-input"
            />
            <button className="admin-btn admin-btn-danger" onClick={() => handleRemove(setEducationalServices, i)} disabled={educationalServices.length <= 1}>Remove</button>
          </div>
        ))}
        <button className="admin-btn admin-btn-secondary" onClick={() => handleAdd(setEducationalServices, { title: "", link: "" })}>Add Service</button>
      </section>

      {/* Vision & Mission */}
      <section className="admin-section">
        <h3 className="admin-section-title">Vision & Mission</h3>
        <textarea
          rows={3}
          className="admin-textarea"
          placeholder="Enter vision and mission statement"
          value={visionMission}
          onChange={e => setVisionMission(e.target.value)}
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
          onChange={e => setFooterContent(e.target.value)}
        />
      </section>

      <button className="admin-btn admin-btn-primary admin-save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default AdminHomePage;