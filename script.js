document.addEventListener('DOMContentLoaded', () => {

    // ================== HEADER KÜÇÜLME EFEKTİ ==================
    const mainHeader = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('shrink');
        } else {
            mainHeader.classList.remove('shrink');
        }
    });

    // ================== VERİLER ==================
    const turkeyCities = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"];

    const campaigns = [
        { from: "İstanbul", to: "Londra", price: "2.450 TL", code: "KTD1AL1BEDAVA", badge: "1 Alana 1 Bedava", img: "ucak.png" },
        { from: "İstanbul", to: "Paris", price: "1.200 TL", code: "KTD50INDIRIM", badge: "%50 İndirim", img: "ucak.png" },
        { from: "İstanbul", to: "New York", price: "3.800 TL", code: "KTDNYC", badge: "Fırsat", img: "ucak.png" },
        { from: "Ankara", to: "İzmir", price: "900 TL", code: "KTDIC", badge: "Yurt İçi", img: "ucak.png" },
        { from: "İstanbul", to: "Tokyo", price: "12.500 TL", code: "KTDTOKYO", badge: "Uzak Doğu", img: "ucak.png" },
        { from: "İzmir", to: "Berlin", price: "2.100 TL", code: "KTDBERLIN", badge: "Avrupa", img: "ucak.png" },
        { from: "Antalya", to: "Moskova", price: "3.200 TL", code: "KTDMOSKOVA", badge: "Kış Fırsatı", img: "ucak.png" },
        { from: "İstanbul", to: "Dubai", price: "4.500 TL", code: "KTDDUBAI", badge: "Körfez", img: "ucak.png" },
        { from: "Trabzon", to: "İstanbul", price: "750 TL", code: "KTDTRABZON", badge: "Yurt İçi", img: "ucak.png" },
        { from: "İstanbul", to: "Roma", price: "2.800 TL", code: "KTROMA", badge: "Kültür Turu", img: "ucak.png" }
    ];

    const coupons = [
        { code: "KTDKASIM", desc: "500 TL İndirim" },
        { code: "ILKUYE1000", desc: "İlk Üyeye 1000 TL İndirim" },
        { code: "ILKMISAFIR", desc: "İlk Misafir Bedava" },
        { code: "UYGULAMA1200", desc: "Uygulamaya Özel 1200 TL" },
        { code: "KTD50INDIRIM", desc: "%50 İndirim" },
        { code: "KTD1AL1BEDAVA", desc: "1 Alana 1 Bedava" }
    ];

    // Filoya Pasif (Bakımda) uçaklar eklendi
    const fleet = [
        { model: "Boeing 787-9 Dreamliner", code: "KTD-001", capacity: 300, image: "ucak.png", status: "Aktif" },
        { model: "Airbus A350-900", code: "KTD-002", capacity: 342, image: "ucak.png", status: "Aktif" },
        { model: "Airbus A321neo", code: "KTD-003", capacity: 190, image: "ucak.png", status: "Aktif" },
        { model: "Boeing 737 MAX 8", code: "KTD-004", capacity: 168, image: "ucak.png", status: "Aktif" },
        { model: "Airbus A330-300", code: "KTD-005", capacity: 280, image: "ucak.png", status: "Pasif (Bakımda)" },
        { model: "Boeing 777-300ER", code: "KTD-006", capacity: 349, image: "ucak.png", status: "Pasif (Bakımda)" }
    ];

    let isUserLoggedIn = false;
    let currentUser = JSON.parse(localStorage.getItem('ktd_active_user') || 'null');
    if(currentUser) isUserLoggedIn = true;

    let selectedSeat = null;
    let currentTotal = 0; 
    let basePrice = 0;

    // ================== DİL ÇEVİRİSİ ==================
    let currentLang = localStorage.getItem('ktd_lang') || 'tr';
    
    function applyLanguage(lang) {
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });
        document.getElementById('currentLang').textContent = lang.toUpperCase();
        localStorage.setItem('ktd_lang', lang);
    }
    applyLanguage(currentLang);

    const langToggle = document.getElementById('langToggle');
    if(langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'tr' ? 'en' : 'tr';
            applyLanguage(currentLang);
        });
    }

    // ================== ARAMA ÇUBUĞU ==================
    const siteSearch = document.getElementById('siteSearch');
    if(siteSearch) {
        siteSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = siteSearch.value.trim();
                if (query) {
                    const found = window.find(query);
                    if (!found) alert(`"${query}" bulunamadı.`);
                }
            }
        });
    }

    // ================== BİLDİRİMLER ==================
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    if(notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
        });
    }
    document.addEventListener('click', (e) => {
        if(notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBtn) {
            notifDropdown.classList.remove('active');
        }
    });

    // ================== ÇEREZ YÖNETİMİ ==================
    const cookieBanner = document.getElementById('cookieBanner');
    if (!localStorage.getItem('ktd_cookie_consent') && cookieBanner) {
        setTimeout(() => cookieBanner.style.display = 'block', 1500);
    }
    window.acceptCookies = (accepted) => {
        localStorage.setItem('ktd_cookie_consent', accepted ? 'all' : 'required');
        if(cookieBanner) cookieBanner.style.display = 'none';
    };

    // ================== SEKMELER ==================
    const wTabs = document.querySelectorAll('.w-tab');
    const wPanes = document.querySelectorAll('.w-pane');

    if (wTabs.length > 0) {
        wTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                wTabs.forEach(t => t.classList.remove('active'));
                wPanes.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const targetPane = document.getElementById(`pane-${targetId}`);
                if (targetPane) targetPane.classList.add('active');
            });
        });
    }

    // ================== PANOYA KOPYALAMA ==================
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";
            document.body.prepend(textArea);
            textArea.select();
            try { document.execCommand('copy'); } catch (error) { console.error(error); } finally { textArea.remove(); }
        }
        alert(`"${text}" kodu panoya kopyalandı!`);
    }

    // ================== TEMA YÖNETİMİ ==================
    const themeToggleBtn = document.getElementById('themeToggle');
    let currentTheme = localStorage.getItem('ktd_theme') || 'light';
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('ktd_theme', theme);
        if(themeToggleBtn) themeToggleBtn.innerHTML = theme === 'light' ? '🌙 Karanlık Mod' : '☀️ Aydınlık Mod';
    }
    applyTheme(currentTheme);
    
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(currentTheme);
        });
    }

    // ================== KULLANICI DURUMU VE KTD PUAN ==================
    const btnLogin = document.getElementById('openLoginModal');
    const btnProfile = document.getElementById('userProfileBtn');
    const milesBadge = document.getElementById('milesBadge');

    function updateUIForUser() {
        if (currentUser) {
            btnLogin.classList.add('hidden');
            btnProfile.classList.remove('hidden');
            btnProfile.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
            isUserLoggedIn = true;
            
            // KTD Puan Gösterimi
            if(currentUser.points !== undefined) {
                milesBadge.style.display = 'block';
                milesBadge.innerHTML = `⭐ ${currentUser.points} KTD Puan`;
            } else {
                milesBadge.style.display = 'none';
            }
        } else {
            btnLogin.classList.remove('hidden');
            btnProfile.classList.add('hidden');
            milesBadge.style.display = 'none';
            isUserLoggedIn = false;
        }
    }
    updateUIForUser();

    // ================== ŞEHİR SEÇİMİ ==================
    const fromSelect = document.getElementById('fromCity');
    const toSelect = document.getElementById('toCity');
    if (fromSelect && toSelect) {
        turkeyCities.forEach(city => {
            fromSelect.add(new Option(city, city));
            toSelect.add(new Option(city, city));
        });
        fromSelect.value = "İstanbul";
        toSelect.value = "Londra"; 
    }

    const swapBtn = document.querySelector('.swap-btn');
    if(swapBtn && fromSelect && toSelect) {
        swapBtn.addEventListener('click', () => {
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
        });
    }

    // ================== KAMPANYALAR ==================
    const track = document.getElementById('campaignTrack');
    if (track) {
        campaigns.forEach(c => {
            const card = document.createElement('div');
            card.className = 'price-card';
            card.style.minWidth = '280px';
            
            card.addEventListener('click', () => {
                if(fromSelect && toSelect) {
                    if (!Array.from(fromSelect.options).some(o => o.value === c.from)) fromSelect.add(new Option(c.from, c.from));
                    if (!Array.from(toSelect.options).some(o => o.value === c.to)) toSelect.add(new Option(c.to, c.to));
                    fromSelect.value = c.from;
                    toSelect.value = c.to;
                    startBooking(c.from, c.to, "15 Kasım 2026");
                }
            });

            card.innerHTML = `
                <div class="price-img" style="background-image: url('${c.img}');">
                    <div class="campaign-badge">${c.badge}</div>
                    <div class="price-tag">${c.price}</div>
                </div>
                <div class="price-body">
                    <h3>${c.from} ➔ ${c.to}</h3>
                    <p>Kod: <strong>${c.code}</strong></p>
                </div>
            `;
            track.appendChild(card);
        });

        let scrollAmount = 0;
        let slideTimer = setInterval(() => {
            if (track.matches(':hover')) return;
            scrollAmount += 1;
            track.scrollLeft = scrollAmount;
            if (scrollAmount >= (track.scrollWidth - track.clientWidth)) scrollAmount = 0;
        }, 30); 
    }

    const prevBtn = document.getElementById('prevCampaign');
    const nextBtn = document.getElementById('nextCampaign');
    if(prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -300, behavior: 'smooth' }));
    if(nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: 300, behavior: 'smooth' }));

    // ================== İNDİRİM KODLARI ==================
    const couponGrid = document.getElementById('couponGrid');
    if (couponGrid) {
        coupons.forEach(c => {
            const div = document.createElement('div');
            div.className = 'coupon-card'; 
            div.innerHTML = `<div class="coupon-desc">${c.desc}</div><div class="coupon-code">${c.code}</div>`;
            div.addEventListener('click', () => copyToClipboard(c.code));
            couponGrid.appendChild(div);
        });
    }

    // ================== FİLO SAYFASI (PASİF UÇAKLAR EKLENDİ) ==================
    const fleetGrid = document.getElementById('fleetGrid');
    if(fleetGrid) {
        fleet.forEach(f => {
            const card = document.createElement('div');
            card.className = 'fleet-card';
            const statusColor = f.status.includes('Pasif') ? 'var(--brand-red)' : 'var(--success)';
            card.innerHTML = `
                <div class="fleet-img" style="background-image: url('${f.image}');"></div>
                <div class="fleet-info">
                    <h3>${f.model}</h3>
                    <p><strong>Kod:</strong> ${f.code}</p>
                    <p><strong>Kapasite:</strong> ${f.capacity} koltuk</p>
                    <p><strong>Durum:</strong> <span style="color:${statusColor}; font-weight:bold;">${f.status}</span></p>
                </div>
            `;
            fleetGrid.appendChild(card);
        });
    }

    const showFleetSection = () => {
        document.getElementById('mainHome').classList.add('hidden');
        document.getElementById('bookingWizard').classList.add('hidden');
        document.getElementById('profileSection').classList.add('hidden');
        document.getElementById('fleetSection').classList.remove('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    if(document.getElementById('navFleet')) document.getElementById('navFleet').addEventListener('click', showFleetSection);
    if(document.getElementById('quickFleet')) document.getElementById('quickFleet').addEventListener('click', showFleetSection);
    if(document.getElementById('footerFleet')) document.getElementById('footerFleet').addEventListener('click', showFleetSection);
    if(document.getElementById('backFromFleetBtn')) document.getElementById('backFromFleetBtn').addEventListener('click', () => {
        document.getElementById('fleetSection').classList.add('hidden');
        document.getElementById('mainHome').classList.remove('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // ================== PROFİL SAYFASI ==================
    const showProfileSection = () => {
        if(!currentUser) {
            document.getElementById('loginModal').classList.add('active');
            return;
        }
        
        document.getElementById('mainHome').classList.add('hidden');
        document.getElementById('bookingWizard').classList.add('hidden');
        document.getElementById('fleetSection').classList.add('hidden');
        document.getElementById('profileSection').classList.remove('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});

        document.getElementById('profileDisplayName').textContent = currentUser.name;
        document.getElementById('profileDisplayUsername').textContent = "@" + currentUser.username;
        document.getElementById('profileDisplayPoints').textContent = `⭐ ${currentUser.points || 0} KTD Puan`;
        document.getElementById('editName').value = currentUser.name;
        document.getElementById('editEmail').value = currentUser.email || '';
        document.getElementById('editPassword').value = '';

        renderTickets();
    };

    if(btnProfile) btnProfile.addEventListener('click', showProfileSection);
    if(document.getElementById('backFromProfileBtn')) document.getElementById('backFromProfileBtn').addEventListener('click', () => {
        document.getElementById('profileSection').classList.add('hidden');
        document.getElementById('mainHome').classList.remove('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    const renderTickets = () => {
        const list = document.getElementById('myTicketsList');
        list.innerHTML = '';
        
        let tickets = JSON.parse(localStorage.getItem('ktd_tickets') || '[]');
        if(currentUser) {
            tickets = tickets.filter(t => t.owner === currentUser.username || t.owner === undefined);
        }

        if (tickets.length === 0) {
            list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 20px;">Henüz satın alınmış bir biletiniz bulunmamaktadır.</p>';
            return;
        }

        tickets.forEach(t => {
            const card = document.createElement('div');
            card.className = 'ticket-card';
            card.innerHTML = `
                <h4>${t.from} ➔ ${t.to} <span style="font-size: 14px; background: var(--bg); padding: 3px 8px; border-radius: 5px;">PNR: ${t.pnr}</span></h4>
                <div class="ticket-detail-row"><span>Uçuş Numarası:</span><span>${t.flightCode}</span></div>
                <div class="ticket-detail-row"><span>Uçuş Durumu:</span><span style="color: var(--success);">Zamanında</span></div>
                <div class="ticket-detail-row"><span>Tarih:</span><span>${t.date}</span></div>
                <div class="ticket-grid">
                    <div>
                        <div class="ticket-detail-row"><span>Kalkış:</span><span>${t.from} (${t.departTime || '09:00'})</span></div>
                        <div class="ticket-detail-row"><span>Terminal / Kapı:</span><span>${t.terminal || 'A'} / ${t.gate || '1'}</span></div>
                    </div>
                    <div>
                        <div class="ticket-detail-row"><span>Varış:</span><span>${t.to} (${t.arriveTime || '11:00'})</span></div>
                        <div class="ticket-detail-row"><span>Biniş Saati:</span><span>${t.boardingTime || '08:30'}</span></div>
                    </div>
                </div>
                <div class="ticket-detail-row" style="margin-top: 15px;"><span>Yolcu Adı:</span><span>${currentUser.name}</span></div>
                <div class="ticket-detail-row"><span>Koltuk:</span><span>${t.seat}</span></div>
                <div class="ticket-detail-row"><span>Uçak:</span><span>${t.aircraft}</span></div>
                <div class="ticket-detail-row"><span>Bagaj Hakkı:</span><span>20 kg + 8 kg Kabin</span></div>
                <div class="ticket-detail-row"><span>Toplam Tutar:</span><span style="color: var(--brand-red);">${t.total.toLocaleString('tr-TR')} TL</span></div>
            `;
            list.appendChild(card);
        });
    };

    if(document.getElementById('saveProfileChangesBtn')) {
        document.getElementById('saveProfileChangesBtn').addEventListener('click', () => {
            const newName = document.getElementById('editName').value.trim();
            const newEmail = document.getElementById('editEmail').value.trim();
            const newPass = document.getElementById('editPassword').value.trim();
            const msg = document.getElementById('editProfileMsg');

            if (!newName) {
                msg.style.color = 'var(--brand-red)';
                msg.textContent = "Ad Soyad boş bırakılamaz.";
                return;
            }

            let users = JSON.parse(localStorage.getItem('ktd_users') || '[]');
            const idx = users.findIndex(u => u.username === currentUser.username);
            
            if (idx !== -1) {
                users[idx].name = newName;
                users[idx].email = newEmail;
                if (newPass) users[idx].password = newPass;
                
                localStorage.setItem('ktd_users', JSON.stringify(users));
                
                currentUser.name = newName;
                currentUser.email = newEmail;
                localStorage.setItem('ktd_active_user', JSON.stringify(currentUser));
                
                msg.style.color = 'var(--success)';
                msg.textContent = "Bilgiler başarıyla güncellendi!";
                updateUIForUser();
                document.getElementById('profileDisplayName').textContent = newName;
                renderTickets();
            }
        });
    }

    if(document.getElementById('logoutProfileBtn')) {
        document.getElementById('logoutProfileBtn').addEventListener('click', () => {
            localStorage.removeItem('ktd_active_user');
            currentUser = null;
            updateUIForUser();
            document.getElementById('profileSection').classList.add('hidden');
            document.getElementById('mainHome').classList.remove('hidden');
            alert("Çıkış yapıldı.");
        });
    }

    // ================== NAVİGASYON ==================
    const goHome = () => {
        document.getElementById('mainHome').classList.remove('hidden');
        document.getElementById('bookingWizard').classList.add('hidden');
        document.getElementById('fleetSection').classList.add('hidden');
        document.getElementById('profileSection').classList.add('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});
        resetBooking();
    };

    if(document.getElementById('logoHomeBtn')) document.getElementById('logoHomeBtn').addEventListener('click', goHome);
    if(document.getElementById('footerLogo')) document.getElementById('footerLogo').addEventListener('click', goHome);
    if(document.getElementById('backToHomeBtn')) document.getElementById('backToHomeBtn').addEventListener('click', goHome);

    // BİLET AL & KOLTUK SEÇ BUTONU DÜZELTMESİ (Arama alanına odaklanır)
    if(document.getElementById('navBook')) {
        document.getElementById('navBook').addEventListener('click', () => {
            goHome();
            const widget = document.getElementById('mainSearchWidget');
            if(widget) {
                widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // 2 saniyeliğine kırmızı kenarlık efekti ver
                widget.classList.add('highlight-border');
                setTimeout(() => {
                    widget.classList.remove('highlight-border');
                }, 2000);
            }
        });
    }

    if(document.getElementById('navSupport')) {
        document.getElementById('navSupport').addEventListener('click', () => {
            goHome();
            setTimeout(() => document.getElementById('supportSection').scrollIntoView({ behavior: 'smooth' }), 100);
        });
    }
    
    if(document.getElementById('quickSupport')) {
        document.getElementById('quickSupport').addEventListener('click', () => {
            goHome();
            setTimeout(() => document.getElementById('supportSection').scrollIntoView({ behavior: 'smooth' }), 100);
        });
    }

    if(document.getElementById('navContact')) document.getElementById('navContact').addEventListener('click', () => document.getElementById('contactModal').classList.add('active'));

    if(document.getElementById('checkinBtn')) {
        document.getElementById('checkinBtn').addEventListener('click', () => {
            const code = document.getElementById('checkinCode').value.trim();
            if(!code) alert("Lütfen PNR kodu girin.");
            else alert(`${code} kodu için check-in işlemleri başlatıldı. (Demo)`);
        });
    }

    if(document.getElementById('statusBtn')) {
        document.getElementById('statusBtn').addEventListener('click', () => {
            const code = document.getElementById('statusFlightCode').value.trim().toUpperCase();
            if(!code) {
                alert("Lütfen uçuş kodu girin.");
                return;
            }
            const tickets = JSON.parse(localStorage.getItem('ktd_tickets') || '[]');
            const ticket = tickets.find(t => t.flightCode === code);
            if (ticket) {
                alert(`Uçuş Kodu: ${ticket.flightCode}\nDurum: Zamanında\nRota: ${ticket.from} - ${ticket.to}`);
            } else {
                alert("Bu uçuş koduna ait bir kayıt bulunamadı.");
            }
        });
    }

    // ================== CANLI UÇUŞ TAKİBİ ==================
    let mapInitialized = false;
    if(document.getElementById('quickLiveFlights')) {
        document.getElementById('quickLiveFlights').addEventListener('click', () => {
            document.getElementById('liveFlightsModal').classList.add('active');
            if (!mapInitialized) {
                const map = L.map('map').setView([39.9334, 32.8597], 3);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
                const planeIcon = L.divIcon({ html: '<div style="font-size: 24px; transform: rotate(45deg);">✈️</div>', className: 'custom-plane-icon', iconSize: [30, 30] });
                const routes = [
                    { from: [41.0082, 28.9784], to: [51.5074, -0.1278], name: "İstanbul - Londra" },
                    { from: [41.0082, 28.9784], to: [40.7128, -74.0060], name: "İstanbul - New York" },
                    { from: [41.0082, 28.9784], to: [25.2048, 55.2708], name: "İstanbul - Dubai" }
                ];
                routes.forEach(route => {
                    L.polyline([route.from, route.to], {color: '#d90429', weight: 2, dashArray: '5, 10'}).addTo(map);
                    const randomProgress = Math.random() * 0.8 + 0.1;
                    const currentLat = route.from[0] + (route.to[0] - route.from[0]) * randomProgress;
                    const currentLng = route.from[1] + (route.to[1] - route.from[1]) * randomProgress;
                    L.marker([currentLat, currentLng], {icon: planeIcon}).addTo(map).bindPopup(`<b>${route.name}</b><br>Uçuş Devam Ediyor...`);
                });
                mapInitialized = true;
            }
        });
    }

    // ================== GİRİŞ / ÜYE OL / ADMİN ==================
    const loginModal = document.getElementById('loginModal');
    if(document.getElementById('openLoginModal')) {
        document.getElementById('openLoginModal').addEventListener('click', () => {
            loginModal.classList.add('active');
            switchTab('user');
        });
    }
    if(document.getElementById('closeLoginModal')) document.getElementById('closeLoginModal').addEventListener('click', () => loginModal.classList.remove('active'));

    const switchTab = (tab) => {
        document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('formUserLogin').classList.add('hidden');
        document.getElementById('formRegister').classList.add('hidden');
        document.getElementById('formAdmin').classList.add('hidden');
        
        if (tab === 'user') {
            document.getElementById('tabUser').classList.add('active');
            document.getElementById('formUserLogin').classList.remove('hidden');
        } else if (tab === 'register') {
            document.getElementById('tabRegister').classList.add('active');
            document.getElementById('formRegister').classList.remove('hidden');
        } else if (tab === 'admin') {
            document.getElementById('tabAdmin').classList.add('active');
            document.getElementById('formAdmin').classList.remove('hidden');
        }
    };

    document.getElementById('tabUser').addEventListener('click', () => switchTab('user'));
    document.getElementById('tabRegister').addEventListener('click', () => switchTab('register'));
    document.getElementById('tabAdmin').addEventListener('click', () => switchTab('admin'));
    document.getElementById('switchToRegister').addEventListener('click', (e) => { e.preventDefault(); switchTab('register'); });
    document.getElementById('switchToAdmin').addEventListener('click', (e) => { e.preventDefault(); switchTab('admin'); });
    document.getElementById('switchToUser').addEventListener('click', (e) => { e.preventDefault(); switchTab('user'); });

    document.getElementById('demoRegisterBtn').addEventListener('click', () => {
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const user = document.getElementById('regUsername').value.trim();
        const pass = document.getElementById('regPassword').value.trim();
        const err = document.getElementById('regError');
        
        if (!name || !email || !user || !pass) { 
            err.textContent = "Lütfen tüm alanları doldurun."; 
            return; 
        }
        
        let users = JSON.parse(localStorage.getItem('ktd_users') || '[]');
        if (users.find(u => u.username === user)) { 
            err.textContent = "Bu kullanıcı adı alınmış!"; 
            return; 
        }
        
        const newUser = { name, email, username: user, password: pass, points: 1500 }; // Başlangıç puanı
        users.push(newUser);
        localStorage.setItem('ktd_users', JSON.stringify(users));
        
        localStorage.setItem('ktd_active_user', JSON.stringify(newUser));
        currentUser = newUser;
        
        alert("Kayıt Başarılı! Otomatik giriş yapıldı.");
        updateUIForUser();
        loginModal.classList.remove('active');
    });

    document.getElementById('demoUserLoginBtn').addEventListener('click', () => {
        const user = document.getElementById('loginUsername').value.trim();
        const pass = document.getElementById('loginPassword').value.trim();
        const err = document.getElementById('loginError');
        if (!user || !pass) { err.textContent = "Lütfen bilgileri girin."; return; }
        let users = JSON.parse(localStorage.getItem('ktd_users') || '[]');
        const foundUser = users.find(u => u.username === user && u.password === pass);
        
        if (foundUser) {
            currentUser = foundUser;
            localStorage.setItem('ktd_active_user', JSON.stringify(currentUser));
            updateUIForUser();
            alert(`Hoş geldiniz, ${foundUser.name}!`);
            loginModal.classList.remove('active');
        } else { err.textContent = "Hatalı kullanıcı adı veya şifre!"; }
    });

    // ADMIN GİRİŞ DÜZELTMESİ
    document.getElementById('doAdminLoginBtn').addEventListener('click', () => {
        const user = document.getElementById('adminUser').value.toUpperCase().trim();
        const pass = document.getElementById('adminPass').value.toUpperCase().trim();
        const errorDiv = document.getElementById('adminError');
        if (user === 'ADMİN') {
            if (pass === 'KARACA' || pass === 'TANRIVERDİ' || pass === 'DEMİR') {
                
                // Admin için sahte bir kullanıcı objesi oluştur ki buton "Giriş Yap"ta kalmasın
                currentUser = { name: pass, username: 'admin', points: 9999 };
                localStorage.setItem('ktd_active_user', JSON.stringify(currentUser));
                isUserLoggedIn = true;
                
                updateUIForUser(); // UI'ı güncelle (Giriş Yap gizlenir, Profilim görünür)
                alert(`Giriş Başarılı! Hoş geldin Yönetici ${pass}.`);
                loginModal.classList.remove('active');
            } else { errorDiv.textContent = "Hatalı şifre!"; }
        } else { errorDiv.textContent = "Hatalı kullanıcı adı!"; }
    });

    // ================== REZERVASYON ==================
    const mainHome = document.getElementById('mainHome');
    const bookingWizard = document.getElementById('bookingWizard');
    const step1 = document.getElementById('step1_seat');
    const step2 = document.getElementById('step2_services');
    const paymentModal = document.getElementById('paymentModal');
    const ticketModal = document.getElementById('ticketModal');

    const initSeatMap = () => {
        const grid = document.getElementById('seatGrid');
        grid.innerHTML = '';
        for (let i = 1; i <= 30; i++) {
            const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
            cols.forEach((col, index) => {
                if (index === 3) {
                    const aisle = document.createElement('div');
                    aisle.className = 'seat aisle';
                    grid.appendChild(aisle);
                }
                const seatCode = i + col;
                const seatDiv = document.createElement('div');
                seatDiv.className = 'seat';
                seatDiv.textContent = seatCode;
                let zoneClass = '', extraPrice = 0, zoneName = '';
                if (i >= 1 && i <= 5) { zoneClass = 'front'; extraPrice = 300; zoneName = 'Ön Bölge'; }
                else if (i >= 6 && i <= 20) { zoneClass = 'middle'; extraPrice = 100; zoneName = 'Orta Bölge'; }
                else { zoneClass = 'rear'; extraPrice = 0; zoneName = 'Arka Bölge'; }
                seatDiv.classList.add(zoneClass);
                seatDiv.dataset.extraPrice = extraPrice;
                seatDiv.dataset.zoneName = zoneName;
                if (Math.random() < 0.2) { seatDiv.classList.add('occupied'); } 
                else { seatDiv.addEventListener('click', () => selectSeat(seatDiv, seatCode, extraPrice, zoneName)); }
                grid.appendChild(seatDiv);
            });
        }
    };

    const selectSeat = (element, code, extraPrice, zoneName) => {
        if (selectedSeat) selectedSeat.classList.remove('selected');
        element.classList.add('selected');
        selectedSeat = element;
        document.getElementById('selectedSeatText').textContent = code;
        document.getElementById('seatPriceInfo').textContent = `(${zoneName} - +${extraPrice} TL)`;
        document.getElementById('paySeat').textContent = code;
        
        currentTotal = basePrice + extraPrice;
        document.getElementById('totalPriceText').textContent = currentTotal.toLocaleString('tr-TR') + ' TL';
        document.getElementById('finalAmount').textContent = currentTotal.toLocaleString('tr-TR') + ' TL';
    };

    const resetBooking = () => {
        if(selectedSeat) { selectedSeat.classList.remove('selected'); selectedSeat = null; }
        document.getElementById('selectedSeatText').textContent = 'Yok';
        document.getElementById('seatPriceInfo').textContent = '';
        document.querySelectorAll('.extra-service-checkbox').forEach(cb => cb.checked = false);
        
        basePrice = Math.floor(Math.random() * (5000 - 2500 + 1)) + 2500;
        currentTotal = basePrice;
        
        document.getElementById('totalPriceText').textContent = currentTotal.toLocaleString('tr-TR') + ' TL';
        document.getElementById('finalAmount').textContent = currentTotal.toLocaleString('tr-TR') + ' TL';
        step1.classList.remove('hidden');
        step2.classList.add('hidden');
    };

    const startBooking = (customFrom, customTo, customDate) => {
        mainHome.classList.add('hidden');
        document.getElementById('fleetSection').classList.add('hidden');
        document.getElementById('profileSection').classList.add('hidden');
        bookingWizard.classList.remove('hidden');
        
        resetBooking();
        if (!document.getElementById('seatGrid').hasChildNodes()) initSeatMap();
        window.scrollTo({top: 0, behavior: 'smooth'});
        
        let from = "İstanbul";
        let to = "Londra";
        let date = "15 Kasım 2026";

        if (customFrom && customTo) {
            from = customFrom;
            to = customTo;
            if (customDate) date = customDate;
        } else if (fromSelect && toSelect) {
            from = fromSelect.value;
            to = toSelect.value;
            const dateInput = document.getElementById('departDate').value;
            if(dateInput) {
                const d = new Date(dateInput);
                date = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        }
        
        document.getElementById('bookingRouteText').textContent = `${from} ➔ ${to} | ${date} | Ekonomi`;
    };

    if(document.getElementById('searchFlightBtn')) document.getElementById('searchFlightBtn').addEventListener('click', () => startBooking());
    if(document.getElementById('quickSeat')) document.getElementById('quickSeat').addEventListener('click', () => startBooking());

    if(document.getElementById('toStep2Btn')) {
        document.getElementById('toStep2Btn').addEventListener('click', () => {
            if (!selectedSeat) return alert("Lütfen önce bir koltuk seçin!");
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        });
    }

    if(document.getElementById('backToStep1Btn')) {
        document.getElementById('backToStep1Btn').addEventListener('click', () => {
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
        });
    }

    document.querySelectorAll('.extra-service-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            if (e.target.checked) currentTotal += val;
            else currentTotal -= val;
            document.getElementById('totalPriceText').textContent = currentTotal.toLocaleString('tr-TR') + ' TL';
            document.getElementById('finalAmount').textContent = currentTotal.toLocaleString('tr-TR') + ' TL';
        });
    });

    if(document.getElementById('toPaymentBtn')) document.getElementById('toPaymentBtn').addEventListener('click', () => paymentModal.classList.add('active'));
    if(document.getElementById('closePaymentModal')) document.getElementById('closePaymentModal').addEventListener('click', () => paymentModal.classList.remove('active'));

    if(document.getElementById('applyCouponBtn')) {
        document.getElementById('applyCouponBtn').addEventListener('click', () => {
            const code = document.getElementById('couponCode').value.toUpperCase();
            const msg = document.getElementById('couponMsg');
            let discount = 0;
            if (code === 'KTDKASIM') discount = 500;
            else if (code === 'KTD50INDIRIM') discount = currentTotal * 0.5;
            
            if (discount > 0) {
                msg.style.display = 'block'; msg.style.color = 'var(--success)';
                msg.textContent = `İndirim uygulandı: -${discount} TL`;
                currentTotal = Math.max(0, currentTotal - discount);
                document.getElementById('finalAmount').textContent = currentTotal.toLocaleString('tr-TR') + ' TL';
            } else {
                msg.style.display = 'block'; msg.style.color = 'var(--brand-red)';
                msg.textContent = "Geçersiz kupon!";
            }
        });
    }

    // ÖDEME TAMAMLAMA VE KTD PUAN EKLEME
    if(document.getElementById('completePaymentBtn')) {
        document.getElementById('completePaymentBtn').addEventListener('click', () => {
            if (!document.getElementById('cardName').value || !document.getElementById('cardNumber').value) {
                alert("Lütfen kart bilgilerini doldurun."); return;
            }
            
            const flightCode = 'KTD' + Math.floor(100 + Math.random() * 900);
            const pnr = 'X' + Math.floor(10000 + Math.random() * 90000) + 'KTD';
            const from = fromSelect ? fromSelect.value : "İstanbul";
            const to = toSelect ? toSelect.value : "Londra";
            const date = new Date().toLocaleDateString('tr-TR');
            
            const depHour = String(Math.floor(8 + Math.random() * 12)).padStart(2, '0');
            const departTime = `${depHour}:${Math.random() < 0.5 ? '00' : '30'}`;
            const arriveTime = `${String(parseInt(depHour) + 2).padStart(2, '0')}:${Math.random() < 0.5 ? '15' : '45'}`;
            const boardingTime = `${String(parseInt(depHour) - 1).padStart(2, '0')}:${Math.random() < 0.5 ? '00' : '30'}`;
            const terminal = 'Terminal ' + (Math.random() < 0.5 ? 'A' : 'D');
            const gate = 'Kapı ' + Math.floor(1 + Math.random() * 20);
            const aircraft = 'Boeing 787-9 Dreamliner (KTD-001)';
            const seat = selectedSeat ? selectedSeat.textContent : 'Atanmadı';
            
            const ticket = { 
                flightCode, pnr, from, to, date, 
                departTime, arriveTime, boardingTime, 
                terminal, gate, aircraft, seat, 
                total: currentTotal, 
                owner: currentUser ? currentUser.username : 'guest'
            };
            
            let tickets = JSON.parse(localStorage.getItem('ktd_tickets') || '[]');
            tickets.push(ticket);
            localStorage.setItem('ktd_tickets', JSON.stringify(tickets));

            // KTD PUAN ARTTIRMA
            if (currentUser) {
                currentUser.points = (currentUser.points || 0) + 150;
                
                // Kullanıcı listesini de güncelle
                let users = JSON.parse(localStorage.getItem('ktd_users') || '[]');
                const uIdx = users.findIndex(u => u.username === currentUser.username);
                if(uIdx !== -1) {
                    users[uIdx].points = currentUser.points;
                    localStorage.setItem('ktd_users', JSON.stringify(users));
                }
                
                localStorage.setItem('ktd_active_user', JSON.stringify(currentUser));
                updateUIForUser(); // Ekrandaki KTD Puanı güncelle
            }

            document.getElementById('ticketFlightCode').textContent = ticket.flightCode;
            document.getElementById('ticketFrom').textContent = ticket.from;
            document.getElementById('ticketTo').textContent = ticket.to;
            document.getElementById('ticketDate').textContent = ticket.date;
            document.getElementById('ticketTime').textContent = ticket.departTime;
            document.getElementById('ticketAircraft').textContent = ticket.aircraft;
            document.getElementById('ticketSeat').textContent = ticket.seat;
            document.getElementById('ticketTotal').textContent = ticket.total.toLocaleString('tr-TR') + ' TL';

            paymentModal.classList.remove('active');
            ticketModal.classList.add('active');
        });
    }

    // ================== CHATBOT ==================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    if(chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
        });
    }

    if(closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });
    }

    const handleChatSend = () => {
        const text = chatInput.value.trim();
        if (!text) return;
        
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user';
        userMsg.textContent = text;
        chatBody.appendChild(userMsg);
        chatInput.value = '';

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-msg bot';
            
            if (!isUserLoggedIn) {
                botMsg.innerHTML = "Size yardımcı olabilmem için lütfen önce <a href='javascript:void(0)' onclick='document.getElementById(\"openLoginModal\").click(); document.getElementById(\"chatWindow\").classList.remove(\"open\");' style='color:var(--brand-red); font-weight:bold; text-decoration:underline;'>giriş yapın</a> veya <a href='javascript:void(0)' onclick='document.getElementById(\"openLoginModal\").click(); document.getElementById(\"tabRegister\").click(); document.getElementById(\"chatWindow\").classList.remove(\"open\");' style='color:var(--brand-red); font-weight:bold; text-decoration:underline;'>üye olun</a>.";
                chatBody.appendChild(botMsg);
                chatBody.scrollTop = chatBody.scrollHeight;
                return;
            }

            const lower = text.toLowerCase();
            let response = "";

            if (lower.includes('merhaba') || lower.includes('selam') || lower.includes('günaydın')) {
                response = "Merhaba! Ben KTD Asistan. Size bilet, bagaj, iptal veya indirimler konusunda yardımcı olabilirim.";
            } else if (lower.includes('bagaj')) {
                response = "Ekonomi sınıfında 20 kg, Business sınıfında 30 kg bagaj hakkınız var. Ekstra bagaj satın alabilirsiniz.";
            } else if (lower.includes('iptal') || lower.includes('iade')) {
                response = "Biletinizi uçuştan 24 saat öncesine kadar iptal edebilirsiniz. Çağrı merkezimizi (444 0 849) arayabilirsiniz.";
            } else if (lower.includes('indirim') || lower.includes('kupon')) {
                response = "Sitemizdeki 'KTDKASIM' veya 'KTD50INDIRIM' kupon kodlarını ödeme adımında kullanabilirsiniz!";
            } else if (lower.includes('bilet') || lower.includes('fiyat')) {
                response = "Bilet fiyatlarımız 1.200 TL'den başlamaktadır. Hangi destinasyon için fiyat almak istersiniz?";
            } else if (lower.includes('uçuş') || lower.includes('uçak')) {
                response = "Filomuzdaki uçaklar hakkında bilgi almak için 'Filo' sekmesini inceleyebilirsiniz.";
            } else {
                response = "Bunu tam anlayamadım. Bana bagaj, iptal, indirim veya bilet fiyatları hakkında soru sorabilirsiniz.";
            }
            
            botMsg.textContent = response;
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 600);
        
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    if(sendChatBtn) sendChatBtn.addEventListener('click', handleChatSend);
    if(chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChatSend(); });
});