document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching for Dashboard Views
  const tabBtns = document.querySelectorAll('.tab-btn');
  const previewImg = document.getElementById('dashboard-preview-img');
  const viewCaption = document.getElementById('view-caption');

  const views = {
    overview: {
      src: 'assets/images/dashboard-overview.png',
      alt: 'ABC Institute - Executive Overview Dashboard View',
      caption: 'Executive Overview View: Total Revenue (₹6.88M), Student Demographics, Monthly Enrollments & Completion Gauge'
    },
    courses: {
      src: 'assets/images/dashboard-courses.png',
      alt: 'ABC Institute - Courses Exploration View',
      caption: 'Courses View: Curriculum-specific Performance, Tuition Collections & Student Satisfaction Rating (4.3 / 5)'
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const viewKey = btn.getAttribute('data-view');
      if (views[viewKey] && previewImg) {
        previewImg.style.opacity = '0';
        setTimeout(() => {
          previewImg.src = views[viewKey].src;
          previewImg.alt = views[viewKey].alt;
          if (viewCaption) {
            viewCaption.textContent = views[viewKey].caption;
          }
          previewImg.style.opacity = '1';
        }, 200);
      }
    });
  });

  // Smooth Scrolling for In-Page Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
