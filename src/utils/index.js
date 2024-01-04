export const STAGE_TYPE_COUNT = "stage_type_count";
export const REASON_TYPE_COUNT = "reason_type_count";

export function setCompanyDomain(value) {
  localStorage.setItem("COMPANY_DOMAIN", value);
}
export function getCompanyDomain() {
  return localStorage.getItem("COMPANY_DOMAIN");
}

export function waitForElementToExist(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  });
}

// date formate
export const FormatDate = (date) => {
  return date
    ?.toISOString()
    .replace(/T/, " ")
    .replace(/:00.000Z/, "");
};

// today date with formated
export const TodayDate = (daysToAdd = 0) => {
  const currentDate = new Date();
  const targetDate = new Date(currentDate);
  targetDate.setDate(currentDate.getDate() + daysToAdd);

  return targetDate
    .toISOString()
    .replace(/T/, " ")
    .replace(/:00.000Z/, "");

  // return new Date()
  //   .toISOString()
  //   .replace(/T/, " ")
  //   .replace(/:00.000Z/, "");
};

export const handleHtmlToBlob = async (html) => {
  const html2canvas = (await import('html2canvas')).default;
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.innerHTML = html;
  document.body.appendChild(container);
  const blob = await new Promise(resolve => {
    html2canvas(container, { useCORS: true }).then(canvas => {
      return canvas.toBlob(resolve, 'png', 1.0);
    });
  });
  const imageUrl = window.URL.createObjectURL(new Blob([blob]));
  setTimeout(() => {
    container.style.display = 'none';
  }, 500);
  return { imageUrl, blob };
}

export const returnSubstring = (str, num) => {
  if (!str) {
    return null;
  }
  else if (str.length > num) {
    return str.substring(0, num) + "..."
  } 

  return str;
}