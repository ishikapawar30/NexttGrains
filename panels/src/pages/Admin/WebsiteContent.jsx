import "./WebsiteContent.css";
import {
  Image,
  FileText,
  ArrowRight,
  LayoutGrid,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function WebsiteContent() {
  const navigate = useNavigate();

  return (
    <div className="website-content-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="website-content-header">

        <div>
          <span className="website-content-eyebrow">
            WEBSITE MANAGEMENT
          </span>

          <h1>Website Content</h1>

          <p>
            Manage the visual content, banners and sections
            displayed across the NextTGrains storefront.
          </p>
        </div>

      </div>


      {/* =====================================================
          HOME PAGE
      ====================================================== */}

      <section className="content-section">

        <div className="content-section-heading">

          <div>
            <span>HOME PAGE</span>
            <h2>Homepage Content</h2>
          </div>

        </div>


        <div className="content-card-grid">

          {/* HERO BANNER */}

          <div className="content-management-card">

            <div className="content-card-icon">
              <Image size={24} />
            </div>

            <div className="content-card-body">

              <span className="content-card-label">
                HOME · HERO
              </span>

              <h3>Hero Banner</h3>

              <p>
                Manage the main hero banner displayed on the
                NextTGrains homepage.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/website-content/hero")
                }
              >
                Manage Hero
                <ArrowRight size={17} />
              </button>

            </div>

          </div>


          {/* HOMEPAGE SECTIONS */}

          <div className="content-management-card disabled">

            <div className="content-card-icon">
              <LayoutGrid size={24} />
            </div>

            <div className="content-card-body">

              <span className="content-card-label">
                HOME · SECTIONS
              </span>

              <h3>Homepage Sections</h3>

              <p>
                Manage featured sections, promotional content
                and other homepage elements.
              </p>

              <span className="coming-soon">
                COMING SOON
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT PAGE
      ====================================================== */}

      <section className="content-section">

        <div className="content-section-heading">

          <div>
            <span>ABOUT PAGE</span>
            <h2>About Content</h2>
          </div>

        </div>


        <div className="content-card-grid">

          {/* ABOUT BANNER */}

          <div className="content-management-card disabled">

            <div className="content-card-icon">
              <Image size={24} />
            </div>

            <div className="content-card-body">

              <span className="content-card-label">
                ABOUT · BANNER
              </span>

              <h3>About Banner</h3>

              <p>
                Manage the main visual banner displayed
                on the About page.
              </p>

              <span className="coming-soon">
                COMING SOON
              </span>

            </div>

          </div>


          {/* ABOUT CONTENT */}

          <div className="content-management-card disabled">

            <div className="content-card-icon">
              <FileText size={24} />
            </div>

            <div className="content-card-body">

              <span className="content-card-label">
                ABOUT · CONTENT
              </span>

              <h3>About Content</h3>

              <p>
                Manage About page text, images and
                other content.
              </p>

              <span className="coming-soon">
                COMING SOON
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR STORY
      ====================================================== */}

      <section className="content-section">

        <div className="content-section-heading">

          <div>
            <span>OUR STORY</span>
            <h2>Story Content</h2>
          </div>

        </div>


        <div className="content-management-card disabled">

          <div className="content-card-icon">
            <BookOpen size={24} />
          </div>

          <div className="content-card-body">

            <span className="content-card-label">
              STORY
            </span>

            <h3>Our Story</h3>

            <p>
              Manage the content, imagery and sections
              of the NextTGrains story page.
            </p>

            <span className="coming-soon">
              COMING SOON
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default WebsiteContent;