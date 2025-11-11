// Temporary in-memory database for testing without MongoDB
class TempDB {
  constructor() {
    this.data = {
      users: [],
      jobs: [],
      applications: [],
      reviews: []
    };
    this.idCounter = 1;
  }

  // Generate unique ID
  generateId() {
    return this.idCounter++;
  }

  // Users
  createUser(userData) {
    const user = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.data.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.data.users.find(user => user.id == id);
  }

  updateUser(id, updateData) {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updateData, { updatedAt: new Date() });
      return user;
    }
    return null;
  }

  // Jobs
  createJob(jobData) {
    const job = {
      id: this.generateId(),
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.jobs.push(job);
    return job;
  }

  findAllJobs() {
    return this.data.jobs;
  }

  findJobById(id) {
    return this.data.jobs.find(job => job.id == id);
  }

  updateJob(id, updateData) {
    const job = this.findJobById(id);
    if (job) {
      Object.assign(job, updateData, { updatedAt: new Date() });
      return job;
    }
    return null;
  }

  deleteJob(id) {
    const index = this.data.jobs.findIndex(job => job.id == id);
    if (index !== -1) {
      this.data.jobs.splice(index, 1);
      return true;
    }
    return false;
  }

  // Applications
  createApplication(appData) {
    const application = {
      id: this.generateId(),
      ...appData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.applications.push(application);
    return application;
  }

  findApplicationsByUserId(userId) {
    return this.data.applications.filter(app => app.userId == userId);
  }

  findApplicationsByJobId(jobId) {
    return this.data.applications.filter(app => app.jobId == jobId);
  }

  updateApplication(id, updateData) {
    const application = this.data.applications.find(app => app.id == id);
    if (application) {
      Object.assign(application, updateData, { updatedAt: new Date() });
      return application;
    }
    return null;
  }

  deleteApplication(id) {
    const index = this.data.applications.findIndex(app => app.id == id);
    if (index !== -1) {
      this.data.applications.splice(index, 1);
      return true;
    }
    return false;
  }

  // Reviews
  createReview(reviewData) {
    const review = {
      id: this.generateId(),
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.reviews.push(review);
    return review;
  }

  findReviewsByJobId(jobId) {
    return this.data.reviews.filter(review => review.jobId == jobId);
  }

  updateReview(id, updateData) {
    const review = this.data.reviews.find(review => review.id == id);
    if (review) {
      Object.assign(review, updateData, { updatedAt: new Date() });
      return review;
    }
    return null;
  }

  deleteReview(id) {
    const index = this.data.reviews.findIndex(review => review.id == id);
    if (index !== -1) {
      this.data.reviews.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Create a singleton instance
const tempDb = new TempDB();

module.exports = tempDb;