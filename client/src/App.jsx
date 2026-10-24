
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = '/api/businesses';

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load businesses from the backend
  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load businesses');
        }

        return response.json();
      })
      .then((result) => {
        setBusinesses(
          Array.isArray(result.data) ? result.data : []
        );
      })
      .catch(() => {
        setError('Unable to load businesses. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Register a new business
  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setFormMessage('');
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Unable to register your business.'
        );
      }

      if (result.data) {
        setBusinesses((currentBusinesses) => [
          ...currentBusinesses,
          result.data,
        ]);
      }

      setFormData({
        name: '',
        category: '',
        description: '',
      });

      setFormMessage(
        'Your business has been registered successfully!'
      );

      setSearchTerm('');
      setSelectedCategory('All');
    } catch (err) {
      setFormMessage(
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Step 10: Get the available business categories
  const categories = [
    'All',
    ...new Set(
      businesses
        .map((business) => business.category)
        .filter(Boolean)
    ),
  ];

  // Step 10: Search businesses and filter by category
  const filteredBusinesses = businesses.filter((business) => {
    const search = searchTerm.trim().toLowerCase();

    const name = String(business.name || '').toLowerCase();
    const category = String(business.category || '').toLowerCase();
    const description = String(
      business.description || ''
    ).toLowerCase();

    const matchesSearch =
      name.includes(search) ||
      category.includes(search) ||
      description.includes(search);

    const matchesCategory =
      selectedCategory === 'All' ||
      business.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Clear search and category filters
  function clearSearchAndFilters() {
    setSearchTerm('');
    setSelectedCategory('All');
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <a href="/" className="logo">
          Biz<span>Lift</span>
        </a>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#businesses">Businesses</a>
          <a href="#resources">Resources</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#about">About Us</a>
        </div>

        <a href="#register" className="nav-button">
          Get Started
        </a>
      </nav>

      <main>
        {/* Hero section */}
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              EMPOWERING SOUTH AFRICAN ENTREPRENEURS
            </p>

            <h1>
              Your business idea.
              <br />
              <span>Your future.</span>
            </h1>

            <p className="hero-description">
              Have a business idea but don't know where to start?
              BizLift helps young entrepreneurs find guidance,
              useful resources, and opportunities to grow.
            </p>

            <div className="hero-buttons">
              <a href="#features" className="primary-button">
                Explore Resources →
              </a>

              <a href="#businesses" className="secondary-button">
                Discover Businesses
              </a>
            </div>

            <div className="hero-note">
              <span>🇿🇦</span>
              Built for the next generation of South African entrepreneurs.
            </div>
          </div>

          <div className="hero-card">
            <div className="card-icon">🚀</div>
            <p className="card-label">YOUR NEXT CHAPTER</p>
            <h2>Turn your idea into action.</h2>

            <p>
              Learn new skills, explore opportunities, and take
              the next step towards building your business.
            </p>

            <div className="progress-item">
              <span>Business planning</span>
              <span>01</span>
            </div>

            <div className="progress-item">
              <span>Finding opportunities</span>
              <span>02</span>
            </div>

            <div className="progress-item">
              <span>Growing your business</span>
              <span>03</span>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="features section" id="features">
          <div className="section-heading">
            <p className="eyebrow">YOUR JOURNEY STARTS HERE</p>

            <h2>
              Everything you need to take the next step.
            </h2>

            <p>
              Practical support to help turn your business idea
              into something real.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Learn New Skills</h3>

              <p>
                Discover learning resources to build your business
                knowledge and confidence.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Plan Your Business</h3>

              <p>
                Get started with practical business planning
                guidance and useful templates.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Find Opportunities</h3>

              <p>
                Explore funding information, support programmes,
                and opportunities for entrepreneurs.
              </p>
            </article>
          </div>
        </section>

        {/* Business listings and Step 10 search */}
        <section
          className="business-section section"
          id="businesses"
        >
          <div>
            <p className="eyebrow">
              LOCAL IDEAS, BIG POSSIBILITIES
            </p>

            <h2>Discover businesses.</h2>

            <p>
              Explore example businesses and get inspired by
              entrepreneurs building their futures.
            </p>
          </div>

          {/* Search and category filter */}
          <div className="business-search-controls">
            <input
              type="search"
              className="business-search-input"
              placeholder="Search by business name or keyword..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              aria-label="Search businesses by name, category, or description"
            />

            <select
              className="business-category-select"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
              aria-label="Filter businesses by category"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'All'
                    ? 'All Categories'
                    : category}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="secondary-button"
              onClick={clearSearchAndFilters}
            >
              Clear Filters
            </button>
          </div>

          {/* Search results count */}
          {!loading && !error && (
            <p
              className="business-results-count"
              aria-live="polite"
            >
              Showing {filteredBusinesses.length}{' '}
              {filteredBusinesses.length === 1
                ? 'business'
                : 'businesses'}
            </p>
          )}

          {/* Business results */}
          <div id="business-list" className="business-grid">
            {loading && (
              <p>Loading businesses...</p>
            )}

            {error && (
              <p role="alert">{error}</p>
            )}

            {!loading &&
              !error &&
              businesses.length === 0 && (
                <div className="no-business-results">
                  <h3>No businesses have been added yet.</h3>

                  <p>
                    Register a business to start building the
                    BizLift business community.
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              businesses.length > 0 &&
              filteredBusinesses.length > 0 && (
                <div className="business-cards">
                  {filteredBusinesses.map((business, index) => (
                    <article
                      className="business-card"
                      key={
                        business.id ??
                        `${business.name}-${index}`
                      }
                    >
                      <h3>{business.name}</h3>

                      <p className="business-category">
                        {business.category || 'Other'}
                      </p>

                      <p>
                        {business.description ||
                          'No description provided.'}
                      </p>
                    </article>
                  ))}
                </div>
              )}

            {/* Message when no search results match */}
            {!loading &&
              !error &&
              businesses.length > 0 &&
              filteredBusinesses.length === 0 && (
                <div className="no-business-results">
                  <h3>No businesses found.</h3>

                  <p>
                    Try another search term or choose a
                    different category.
                  </p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={clearSearchAndFilters}
                  >
                    Clear Search and Filters
                  </button>
                </div>
              )}
          </div>
        </section>

        {/* Business registration */}
        <section
          className="registration-section section"
          id="register"
        >
          <div className="section-heading">
            <p className="eyebrow">START YOUR JOURNEY</p>

            <h2>Register your business.</h2>

            <p>
              Tell us about your business and add your profile to BizLift.
            </p>
          </div>

          <form
            className="registration-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="business-name">
              Business name
            </label>

            <input
              id="business-name"
              type="text"
              placeholder="e.g. Kay's Bakery"
              value={formData.name}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  name: event.target.value,
                })
              }
              required
            />

            <label htmlFor="business-category">
              Business category
            </label>

            <select
              id="business-category"
              value={formData.category}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  category: event.target.value,
                })
              }
              required
            >
              <option value="">Choose a category</option>
              <option value="Food and Baking">
                Food and Baking
              </option>
              <option value="Technology">
                Technology
              </option>
              <option value="Fashion and Beauty">
                Fashion and Beauty
              </option>
              <option value="Agriculture">
                Agriculture
              </option>
              <option value="Retail">
                Retail
              </option>
              <option value="Other">
                Other
              </option>
            </select>

            <label htmlFor="business-description">
              Business description
            </label>

            <textarea
              id="business-description"
              rows="4"
              placeholder="Tell us what your business does..."
              value={formData.description}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  description: event.target.value,
                })
              }
              required
            />

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? 'Registering...'
                : 'Register Business'}
            </button>

            {formMessage && (
              <p role="status" aria-live="polite">
                {formMessage}
              </p>
            )}
          </form>
        </section>

        {/* Business Dashboard */}
        <BusinessDashboard businesses={businesses} />

        {/* Business Planner */}
        <section
          className="planner-section section"
          id="planner"
        >
          <div className="section-heading">
            <p className="eyebrow">PLAN YOUR FUTURE</p>

            <h2>Create your business plan.</h2>

            <p>
              Start organising your business idea with this
              simple planning tool.
            </p>
          </div>

          <BusinessPlanner />
        </section>

        {/* Resources and Opportunities */}
        <ResourcesSection />

        {/* Business Tips */}
        <BusinessTips />

        {/* About section */}
        <section
          className="about-section section"
          id="about"
        >
          <p className="eyebrow">OUR MISSION</p>

          <h2>
            Helping young people build a better future.
          </h2>

          <p>
            BizLift aims to make business guidance and growth
            opportunities easier for young South African
            entrepreneurs to discover.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <a href="/" className="logo">
          Biz<span>Lift</span>
        </a>

        <p>Helping ideas grow into businesses.</p>

        <p>
          © 2026 BizLift. Built for South African entrepreneurs.
        </p>
      </footer>
    </div>
  );
}

// Resources and Opportunities component
function ResourcesSection() {
  const resources = [
    {
      category: 'Business Training',
      title: 'Learn Business Skills',
      description:
        'Build your knowledge of business planning, marketing, customer service, and managing money.',
      action: 'Explore Training',
      link: 'https://www.seda.org.za/',
    },
    {
      category: 'Business Support',
      title: 'Get Business Guidance',
      description:
        'Find information about business development support and services for small enterprises.',
      action: 'Visit SEDA',
      link: 'https://www.seda.org.za/',
    },
    {
      category: 'Funding Information',
      title: 'Explore Funding Options',
      description:
        'Learn about possible funding programmes and check their requirements before applying.',
      action: 'Explore Funding',
      link: 'https://www.dsbd.gov.za/',
    },
    {
      category: 'Business Registration',
      title: 'Register Your Business',
      description:
        'Find official information about registering a company in South Africa.',
      action: 'Visit CIPC',
      link: 'https://www.cipc.co.za/',
    },
  ];

  return (
    <section
      className="resources-section section"
      id="resources"
    >
      <div className="section-heading">
        <p className="eyebrow">GROW YOUR BUSINESS</p>

        <h2>Resources and Opportunities</h2>

        <p>
          Find useful resources to help you learn, plan, and grow
          your business.
        </p>
      </div>

      <div className="resources-grid">
        {resources.map((resource) => (
          <article
            className="resource-card"
            key={resource.title}
          >
            <span className="resource-category">
              {resource.category}
            </span>

            <h3>{resource.title}</h3>

            <p>{resource.description}</p>

            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              {resource.action} ↗
            </a>
          </article>
        ))}
      </div>

      <p className="resources-note">
        Please check each organisation's official website for current
        programmes, deadlines, eligibility requirements, and application
        details. Funding is not guaranteed.
      </p>
    </section>
  );
}

// Business Tips component
function BusinessTips() {
  const tips = [
    {
      number: '01',
      title: 'Start Small',
      description:
        'Start with what you can afford. Test your business idea before spending a lot of money.',
      category: 'Getting Started',
    },
    {
      number: '02',
      title: 'Know Your Customers',
      description:
        'Understand who will buy your products or services. Ask potential customers what they need.',
      category: 'Customers',
    },
    {
      number: '03',
      title: 'Manage Your Money',
      description:
        'Keep records of your income and expenses. Separate your business money from your personal money where possible.',
      category: 'Finance',
    },
    {
      number: '04',
      title: 'Promote Your Business',
      description:
        'Use social media, word of mouth, and local networks to help people discover your business.',
      category: 'Marketing',
    },
    {
      number: '05',
      title: 'Provide Good Service',
      description:
        'Treat customers respectfully, deliver what you promise, and learn from their feedback.',
      category: 'Customer Service',
    },
    {
      number: '06',
      title: 'Keep Learning',
      description:
        'Improve your business skills by exploring training, mentorship, and support opportunities.',
      category: 'Growth',
    },
  ];

  return (
    <section
      className="business-tips-section section"
      id="tips"
    >
      <div className="section-heading">
        <p className="eyebrow">LEARN AND GROW</p>

        <h2>Tips for Your Business Journey</h2>

        <p>
          Simple, practical advice to help you take the next step
          with your business.
        </p>
      </div>

      <div className="business-tips-grid">
        {tips.map((tip) => (
          <article
            className="business-tip-card"
            key={tip.number}
          >
            <div className="business-tip-top">
              <span className="business-tip-number">
                {tip.number}
              </span>

              <span className="business-tip-category">
                {tip.category}
              </span>
            </div>

            <h3>{tip.title}</h3>

            <p>{tip.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// Business Dashboard component
function BusinessDashboard({ businesses = [] }) {
  const totalBusinesses = businesses.length;

  const categories = [
    ...new Set(
      businesses
        .map((business) => business.category)
        .filter(Boolean)
    ),
  ];

  const recentBusinesses = [...businesses]
    .reverse()
    .slice(0, 3);

  return (
    <section
      className="dashboard-section section"
      id="dashboard"
    >
      <div className="section-heading">
        <p className="eyebrow">YOUR BUSINESS COMMUNITY</p>

        <h2>BizLift Dashboard</h2>

        <p>
          Get a quick overview of the businesses listed on BizLift.
        </p>
      </div>

      <div className="dashboard-stats">
        <article className="dashboard-stat-card">
          <span className="dashboard-stat-icon">🏢</span>

          <p>Total Businesses</p>

          <h3>{totalBusinesses}</h3>
        </article>

        <article className="dashboard-stat-card">
          <span className="dashboard-stat-icon">📂</span>

          <p>Business Categories</p>

          <h3>{categories.length}</h3>
        </article>

        <article className="dashboard-stat-card">
          <span className="dashboard-stat-icon">📈</span>

          <p>Recent Listings</p>

          <h3>{Math.min(totalBusinesses, 3)}</h3>
        </article>
      </div>

      <div className="dashboard-recent">
        <h3>Latest Business Listings</h3>

        {recentBusinesses.length > 0 ? (
          <div className="dashboard-business-list">
            {recentBusinesses.map((business, index) => (
              <article
                className="dashboard-business-item"
                key={
                  business.id ??
                  `${business.name}-${index}`
                }
              >
                <div>
                  <h4>{business.name}</h4>

                  <p>{business.description}</p>
                </div>

                <span className="dashboard-category">
                  {business.category}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <p className="dashboard-empty">
            No businesses have been listed yet. Register a business
            to get started!
          </p>
        )}
      </div>
    </section>
  );
}

// Business Planner component
function BusinessPlanner() {
  const [plan, setPlan] = useState({
    businessIdea: '',
    targetCustomers: '',
    productsServices: '',
    startupBudget: '',
  });

  const [generatedPlan, setGeneratedPlan] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setPlan((currentPlan) => ({
      ...currentPlan,
      [name]: value,
    }));
  }

  function handleGeneratePlan(event) {
    event.preventDefault();
    setGeneratedPlan({ ...plan });
  }

  return (
    <div className="planner-container">
      <form
        className="planner-form"
        onSubmit={handleGeneratePlan}
      >
        <label htmlFor="businessIdea">
          What is your business idea?
        </label>

        <textarea
          id="businessIdea"
          name="businessIdea"
          placeholder="Example: I want to start a baking business."
          value={plan.businessIdea}
          onChange={handleChange}
          required
        />

        <label htmlFor="targetCustomers">
          Who are your target customers?
        </label>

        <textarea
          id="targetCustomers"
          name="targetCustomers"
          placeholder="Example: Students, families, and local businesses."
          value={plan.targetCustomers}
          onChange={handleChange}
          required
        />

        <label htmlFor="productsServices">
          What will you sell or offer?
        </label>

        <textarea
          id="productsServices"
          name="productsServices"
          placeholder="Describe your products or services."
          value={plan.productsServices}
          onChange={handleChange}
          required
        />

        <label htmlFor="startupBudget">
          Estimated start-up budget (R)
        </label>

        <input
          id="startupBudget"
          name="startupBudget"
          type="number"
          min="0"
          step="0.01"
          placeholder="Example: 2000"
          value={plan.startupBudget}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="primary-button"
        >
          Create My Business Plan
        </button>
      </form>

      {generatedPlan && (
        <div
          className="generated-plan"
          aria-live="polite"
        >
          <h3>Your Business Plan Summary</h3>

          <div>
            <strong>Business idea</strong>
            <p>{generatedPlan.businessIdea}</p>
          </div>

          <div>
            <strong>Target customers</strong>
            <p>{generatedPlan.targetCustomers}</p>
          </div>

          <div>
            <strong>Products or services</strong>
            <p>{generatedPlan.productsServices}</p>
          </div>

          <div>
            <strong>Estimated start-up budget</strong>

            <p>
              R
              {Number(
                generatedPlan.startupBudget
              ).toLocaleString('en-ZA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <p className="planner-note">
            This is your starting summary. Review your costs and
            business goals before making financial decisions.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => window.print()}
          >
            Print Business Plan
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
