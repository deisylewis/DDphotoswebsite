// Debug Tools for D&D Photos Website
// Comprehensive debugging and troubleshooting toolkit

(function() {
    'use strict';

    const debugTools = {
        isEnabled: false,
        logs: [],

        // Initialize debug mode
        init() {
            // Enable debug mode if URL contains debug parameter
            if (window.location.search.includes('debug=true')) {
                this.isEnabled = true;
                this.createDebugPanel();
                this.startLogging();
                console.log('🔧 Debug tools enabled for D&D Photos');
            }
        },

        // Create debug panel
        createDebugPanel() {
            const panel = document.createElement('div');
            panel.id = 'debug-panel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 300px;
                max-height: 400px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            `;

            panel.innerHTML = `
                <div style="margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                    <strong>🔧 D&D Photos Debug Panel</strong>
                    <button onclick="debugTools.togglePanel()" style="float: right; background: #666; border: none; color: white; padding: 2px 6px; border-radius: 3px; cursor: pointer;">×</button>
                </div>
                <div id="debug-content"></div>
            `;

            document.body.appendChild(panel);
            this.updatePanel();
        },

        // Toggle debug panel visibility
        togglePanel() {
            const panel = document.getElementById('debug-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        },

        // Update debug panel content
        updatePanel() {
            if (!this.isEnabled) return;

            const content = document.getElementById('debug-content');
            if (!content) return;

            const metrics = this.getMetrics();
            const issues = this.getIssues();

            content.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>📊 Performance Metrics:</strong><br>
                    LCP: ${metrics.lcp ? Math.round(metrics.lcp) + 'ms' : 'N/A'}<br>
                    FID: ${metrics.fid ? Math.round(metrics.fid) + 'ms' : 'N/A'}<br>
                    CLS: ${metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}<br>
                    TTFB: ${metrics.ttfb ? Math.round(metrics.ttfb) + 'ms' : 'N/A'}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>🔍 SEO Status:</strong><br>
                    Title: ${document.title.length}/60 chars<br>
                    Description: ${document.querySelector('meta[name="description"]')?.content?.length || 0}/160 chars<br>
                    Images: ${document.querySelectorAll('img').length} total<br>
                    Alt tags: ${document.querySelectorAll('img[alt]').length} with alt
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>⚠️ Issues Found:</strong><br>
                    ${issues.length > 0 ? issues.slice(0, 3).map(issue => `• ${issue}`).join('<br>') : 'None detected'}
                    ${issues.length > 3 ? `<br>... and ${issues.length - 3} more` : ''}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>🔗 Quick Actions:</strong><br>
                    <button onclick="debugTools.runSEOCheck()" style="background: #4CAF50; border: none; color: white; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin: 2px;">SEO Check</button>
                    <button onclick="debugTools.runPerformanceTest()" style="background: #2196F3; border: none; color: white; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin: 2px;">Performance</button>
                    <button onclick="debugTools.exportReport()" style="background: #FF9800; border: none; color: white; padding: 4px 8px; border-radius: 3px; cursor: pointer; margin: 2px;">Export</button>
                </div>
            `;
        },

        // Get performance metrics
        getMetrics() {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                lcp: window.performanceMetrics?.lcp || null,
                fid: window.performanceMetrics?.fid || null,
                cls: window.performanceMetrics?.cls || null,
                ttfb: navigation ? navigation.responseStart - navigation.requestStart : null
            };
        },

        // Get current issues
        getIssues() {
            const issues = [];
            
            // Check for missing alt tags
            const imagesWithoutAlt = document.querySelectorAll('img:not([alt])').length;
            if (imagesWithoutAlt > 0) {
                issues.push(`${imagesWithoutAlt} images missing alt text`);
            }

            // Check for missing meta description
            if (!document.querySelector('meta[name="description"]')) {
                issues.push('Missing meta description');
            }

            // Check for missing canonical
            if (!document.querySelector('link[rel="canonical"]')) {
                issues.push('Missing canonical URL');
            }

            // Check for console errors
            if (this.logs.some(log => log.type === 'error')) {
                issues.push('JavaScript errors detected');
            }

            return issues;
        },

        // Start logging
        startLogging() {
            // Override console methods to capture logs
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;

            console.log = (...args) => {
                this.logs.push({ type: 'log', message: args.join(' '), timestamp: Date.now() });
                originalLog.apply(console, args);
            };

            console.error = (...args) => {
                this.logs.push({ type: 'error', message: args.join(' '), timestamp: Date.now() });
                originalError.apply(console, args);
            };

            console.warn = (...args) => {
                this.logs.push({ type: 'warn', message: args.join(' '), timestamp: Date.now() });
                originalWarn.apply(console, args);
            };

            // Monitor for errors
            window.addEventListener('error', (event) => {
                this.logs.push({ 
                    type: 'error', 
                    message: `${event.message} at ${event.filename}:${event.lineno}`, 
                    timestamp: Date.now() 
                });
            });

            // Monitor for unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                this.logs.push({ 
                    type: 'error', 
                    message: `Unhandled promise rejection: ${event.reason}`, 
                    timestamp: Date.now() 
                });
            });
        },

        // Run SEO check
        runSEOCheck() {
            if (window.seoValidator) {
                window.seoValidator.generateReport();
            } else {
                console.log('SEO validator not available');
            }
        },

        // Run performance test
        runPerformanceTest() {
            const metrics = this.getMetrics();
            console.group('🚀 Performance Test Results');
            console.log('LCP (Largest Contentful Paint):', metrics.lcp ? Math.round(metrics.lcp) + 'ms' : 'Not measured');
            console.log('FID (First Input Delay):', metrics.fid ? Math.round(metrics.fid) + 'ms' : 'Not measured');
            console.log('CLS (Cumulative Layout Shift):', metrics.cls ? metrics.cls.toFixed(3) : 'Not measured');
            console.log('TTFB (Time to First Byte):', metrics.ttfb ? Math.round(metrics.ttfb) + 'ms' : 'Not measured');
            
            // Performance recommendations
            const recommendations = [];
            if (metrics.lcp && metrics.lcp > 2500) recommendations.push('LCP is above recommended 2.5s');
            if (metrics.fid && metrics.fid > 100) recommendations.push('FID is above recommended 100ms');
            if (metrics.cls && metrics.cls > 0.1) recommendations.push('CLS is above recommended 0.1');
            if (metrics.ttfb && metrics.ttfb > 600) recommendations.push('TTFB is above recommended 600ms');
            
            if (recommendations.length > 0) {
                console.group('⚠️ Performance Issues:');
                recommendations.forEach(rec => console.log('•', rec));
                console.groupEnd();
            } else {
                console.log('✅ All performance metrics are within recommended ranges');
            }
            console.groupEnd();
        },

        // Export debug report
        exportReport() {
            const report = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                performance: this.getMetrics(),
                seo: {
                    title: document.title,
                    titleLength: document.title.length,
                    description: document.querySelector('meta[name="description"]')?.content,
                    descriptionLength: document.querySelector('meta[name="description"]')?.content?.length || 0,
                    canonical: document.querySelector('link[rel="canonical"]')?.href,
                    images: document.querySelectorAll('img').length,
                    imagesWithAlt: document.querySelectorAll('img[alt]').length
                },
                issues: this.getIssues(),
                logs: this.logs.slice(-50) // Last 50 logs
            };

            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dndphotos-debug-report-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            console.log('📄 Debug report exported');
        },

        // Network monitoring
        monitorNetwork() {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'resource') {
                            if (entry.duration > 3000) {
                                console.warn(`Slow resource load: ${entry.name} (${Math.round(entry.duration)}ms)`);
                            }
                        }
                    }
                });
                observer.observe({ entryTypes: ['resource'] });
            }
        },

        // Accessibility checker
        checkAccessibility() {
            const issues = [];
            
            // Check for proper heading structure
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let previousLevel = 0;
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                if (level > previousLevel + 1) {
                    issues.push(`Heading hierarchy issue: ${heading.tagName} follows H${previousLevel}`);
                }
                previousLevel = level;
            });

            // Check for proper form labels
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (!input.id || !document.querySelector(`label[for="${input.id}"]`)) {
                    issues.push(`Input missing proper label: ${input.type || 'input'}`);
                }
            });

            // Check for sufficient color contrast (basic check)
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
            textElements.forEach(element => {
                const style = window.getComputedStyle(element);
                const color = style.color;
                const backgroundColor = style.backgroundColor;
                
                if (color === backgroundColor) {
                    issues.push(`Potential contrast issue: ${element.tagName} text color matches background`);
                }
            });

            if (issues.length > 0) {
                console.group('♿ Accessibility Issues:');
                issues.forEach(issue => console.log('•', issue));
                console.groupEnd();
            } else {
                console.log('✅ No accessibility issues detected');
            }
        }
    };

    // Initialize debug tools
    debugTools.init();

    // Expose for manual use
    window.debugTools = debugTools;

    // Add keyboard shortcut to toggle debug mode
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            debugTools.isEnabled = !debugTools.isEnabled;
            if (debugTools.isEnabled) {
                debugTools.createDebugPanel();
                debugTools.startLogging();
            } else {
                const panel = document.getElementById('debug-panel');
                if (panel) panel.remove();
            }
        }
    });

})();

