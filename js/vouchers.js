/* globals JSGlobals */
const fetchData = async (topics) => {
  const response = await fetch(`/api/vouchers?topics=${topics}`);
  if (!response.ok) {
    console.warn('United Savings voucher fetch failed.');
    return null;
  } else {
    const data = await response.json();
    return data;
  }
};

const renderVouchers = (voucherData) => {
  const wrapper = document.getElementById('vouchercodes');
  voucherData.forEach((data, index) => {
    const voucherEl = wrapper.querySelector(`#voucher_${index}`);
    const imgLink = voucherEl.querySelector('.voucher_img_link');
    const img = voucherEl.querySelector('.voucher_img');
    const capsule = voucherEl.querySelector('.capsules a');
    const title = voucherEl.querySelector('.title');

    const { logo, anchor_text, best_offer_text, url } = data;
    img.src = logo;
    capsule.textContent = anchor_text;
    title.textContent = best_offer_text;
    capsule.href = imgLink.href = title.href = url;

    voucherEl.classList.add('show');
  });
  wrapper.classList.add('show');
};

const init = async () => {
  const topics = JSGlobals.topictags || '';
  const formattedTopics = topics.map((tag) => tag.replace('s_', ''));

  const storedCodesKey = 'vouchercodes';
  const storedTopicsKey = 'vouchertopics';
  const storedTopics = sessionStorage.getItem(storedTopicsKey);
  if (storedTopics === JSON.stringify(formattedTopics)) {
    return renderVouchers(JSON.parse(sessionStorage.getItem(storedCodesKey)));
  }

  const data = await fetchData(formattedTopics);
  if (data?.length > 0) {
    sessionStorage.setItem(storedCodesKey, JSON.stringify(data));
    sessionStorage.setItem(storedTopicsKey, JSON.stringify(formattedTopics));
    renderVouchers(data);
  }
};

if (document.getElementById('vouchercodes')) {
  init();
}
