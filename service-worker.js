const CACHE_NAME = 'pro-finance-v2';

// অ্যাপ অফলাইনে চলার জন্য যা যা প্রয়োজন
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    // আইকন (যদি থাকে)
    './icon-192x192.png',
    
    // ফন্ট এবং স্টাইল
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    
    // লাইব্রেরি (SweetAlert, ChartJS, jsPDF)
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',

    // Firebase SDK (জরুরি: অফলাইনে অ্যাপ লোড হওয়ার জন্য এগুলো ক্যাশ করতে হবে)
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
];

// ১. ইনস্টল ইভেন্ট: সব ফাইল ক্যাশ করা
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// ২. একটিভেট ইভেন্ট: পুরনো ক্যাশ ডিলিট করা
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// ৩. ফেচ ইভেন্ট: ইন্টারনেট না থাকলে ক্যাশ থেকে ফাইল দেওয়া
self.addEventListener('fetch', (event) => {
    // ফায়ারবেস বা গুগল এপিআই রিকোয়েস্টগুলো নেটওয়ার্ক ফাস্ট স্ট্র্যাটেজিতে হ্যান্ডেল করা ভালো
    if (event.request.url.includes('firestore.googleapis.com')) {
        return; // Firestore এর নিজস্ব অফলাইন লজিক আছে, তাই এখানে বাধা দেব না
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // ক্যাশে পাওয়া গেলে সেটাই রিটার্ন করো, নাহলে ইন্টারনেটে খোঁজ
                return response || fetch(event.request).catch(() => {
                    // ইন্টারনেটও নেই, ক্যাশেও নেই (যেমন নতুন পেজ), তখন কি হবে?
                    // যেহেতু এটা সিঙ্গেল পেজ অ্যাপ, তাই সাধারণত সমস্যা হয় না।
                });
            })
    );
});
