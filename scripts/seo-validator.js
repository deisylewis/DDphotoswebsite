// SEO Validator for D&D Photos
// Checks for common SEO issues and provides recommendations

(function() {
    'use strict';

    const seoValidator = {
        issues: [],
        warnings: [],
        recommendations: [],

        // Check meta tags
        checkMetaTags() {
            const title = document.title;
            const description = document.querySelector('meta[name="description"]')?.content;
            const keywords = document.querySelector('meta[name="keywords"]')?.content;
            const robots = document.querySelector('meta[name="robots"]')?.content;
            const canonical = document.querySelector('link[rel="canonical"]')?.href;

            // Title checks
            if (!title || title.length < 10) {
                this.issues.push('Title tag is too short or missing');
            } else if (title.length > 60) {
                this.warnings.push('Title tag is longer than recommended 60 characters');
            }

            // Description checks
            if (!description) {
                this.issues.push('Meta description is missing');
            } else if (description.length < 50) {
                this.warnings.push('Meta description is shorter than recommended 50 characters');
            } else if (description.length > 160) {
                this.warnings.push('Meta description is longer than recommended 160 characters');
            }

            // Keywords check (optional but good to have)
            if (!keywords) {
                this.recommendations.push('Consider adding meta keywords for better SEO');
            }

            // Robots check
            if (!robots) {
                this.warnings.push('Robots meta tag is missing');
            }

            // Canonical check
            if (!canonical) {
                this.issues.push('Canonical URL is missing');
            }
        },

        // Check Open Graph tags
        checkOpenGraph() {
            const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
            const ogDescription = document.querySelector('meta[property="og:description"]')?.content;
            const ogImage = document.querySelector('meta[property="og:image"]')?.content;
            const ogUrl = document.querySelector('meta[property="og:url"]')?.content;
            const ogType = document.querySelector('meta[property="og:type"]')?.content;

            if (!ogTitle) this.warnings.push('Open Graph title is missing');
            if (!ogDescription) this.warnings.push('Open Graph description is missing');
            if (!ogImage) this.warnings.push('Open Graph image is missing');
            if (!ogUrl) this.warnings.push('Open Graph URL is missing');
            if (!ogType) this.warnings.push('Open Graph type is missing');
        },

        // Check Twitter Card tags
        checkTwitterCard() {
            const twitterCard = document.querySelector('meta[name="twitter:card"]')?.content;
            const twitterTitle = document.querySelector('meta[name="twitter:title"]')?.content;
            const twitterDescription = document.querySelector('meta[name="twitter:description"]')?.content;
            const twitterImage = document.querySelector('meta[name="twitter:image"]')?.content;

            if (!twitterCard) this.warnings.push('Twitter Card type is missing');
            if (!twitterTitle) this.warnings.push('Twitter Card title is missing');
            if (!twitterDescription) this.warnings.push('Twitter Card description is missing');
            if (!twitterImage) this.warnings.push('Twitter Card image is missing');
        },

        // Check structured data
        checkStructuredData() {
            const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
            
            if (structuredData.length === 0) {
                this.warnings.push('No structured data (JSON-LD) found');
            } else {
                structuredData.forEach((script, index) => {
                    try {
                        const data = JSON.parse(script.textContent);
                        if (!data['@type']) {
                            this.issues.push(`Structured data ${index + 1} is missing @type`);
                        }
                    } catch (e) {
                        this.issues.push(`Structured data ${index + 1} has invalid JSON`);
                    }
                });
            }
        },

        // Check images
        checkImages() {
            const images = document.querySelectorAll('img');
            let imagesWithoutAlt = 0;

            images.forEach(img => {
                if (!img.alt || img.alt.trim() === '') {
                    imagesWithoutAlt++;
                }
            });

            if (imagesWithoutAlt > 0) {
                this.issues.push(`${imagesWithoutAlt} images are missing alt text`);
            }

            // Check for lazy loading
            const imagesWithoutLazy = document.querySelectorAll('img:not([loading="lazy"])');
            if (imagesWithoutLazy.length > 0) {
                this.recommendations.push('Consider adding lazy loading to images for better performance');
            }
        },

        // Check headings
        checkHeadings() {
            const h1s = document.querySelectorAll('h1');
            const h2s = document.querySelectorAll('h2');
            const h3s = document.querySelectorAll('h3');

            if (h1s.length === 0) {
                this.issues.push('No H1 heading found');
            } else if (h1s.length > 1) {
                this.warnings.push('Multiple H1 headings found (should typically be only one)');
            }

            if (h2s.length === 0) {
                this.recommendations.push('Consider adding H2 headings for better content structure');
            }

            // Check heading hierarchy
            let previousLevel = 0;
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                if (level > previousLevel + 1) {
                    this.warnings.push(`Heading hierarchy issue: ${heading.tagName} follows ${previousLevel > 0 ? 'H' + previousLevel : 'no heading'}`);
                }
                previousLevel = level;
            });
        },

        // Check links
        checkLinks() {
            const links = document.querySelectorAll('a');
            let linksWithoutText = 0;
            let externalLinks = 0;

            links.forEach(link => {
                if (!link.textContent.trim()) {
                    linksWithoutText++;
                }
                
                if (link.hostname && link.hostname !== window.location.hostname) {
                    externalLinks++;
                    if (!link.rel.includes('nofollow') && !link.rel.includes('sponsored')) {
                        this.recommendations.push('Consider adding rel="nofollow" to external links');
                    }
                }
            });

            if (linksWithoutText > 0) {
                this.issues.push(`${linksWithoutText} links are missing text content`);
            }
        },

        // Check performance indicators
        checkPerformance() {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                const ttfb = navigation.responseStart - navigation.requestStart;
                if (ttfb > 600) {
                    this.warnings.push(`Time to First Byte (${Math.round(ttfb)}ms) is above recommended 600ms`);
                }
            }

            // Check for render-blocking resources
            const renderBlocking = document.querySelectorAll('link[rel="stylesheet"]:not([media="print"])');
            if (renderBlocking.length > 2) {
                this.recommendations.push('Consider combining CSS files to reduce render-blocking resources');
            }
        },

        // Check mobile optimization
        checkMobileOptimization() {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                this.issues.push('Viewport meta tag is missing (required for mobile optimization)');
            }

            // Check for touch targets
            const touchTargets = document.querySelectorAll('a, button, input, select, textarea');
            let smallTouchTargets = 0;
            
            touchTargets.forEach(target => {
                const rect = target.getBoundingClientRect();
                if (rect.width < 44 || rect.height < 44) {
                    smallTouchTargets++;
                }
            });

            if (smallTouchTargets > 0) {
                this.recommendations.push(`${smallTouchTargets} touch targets may be too small for mobile users`);
            }
        },

        // Run all checks
        runAllChecks() {
            this.checkMetaTags();
            this.checkOpenGraph();
            this.checkTwitterCard();
            this.checkStructuredData();
            this.checkImages();
            this.checkHeadings();
            this.checkLinks();
            this.checkPerformance();
            this.checkMobileOptimization();

            return {
                issues: this.issues,
                warnings: this.warnings,
                recommendations: this.recommendations,
                score: this.calculateScore()
            };
        },

        // Calculate SEO score
        calculateScore() {
            let score = 100;
            score -= this.issues.length * 10;
            score -= this.warnings.length * 3;
            score -= this.recommendations.length * 1;
            return Math.max(0, score);
        },

        // Generate report
        generateReport() {
            const results = this.runAllChecks();
            
            console.group('🔍 SEO Validation Report for D&D Photos');
            console.log(`Overall Score: ${results.score}/100`);
            
            if (results.issues.length > 0) {
                console.group('❌ Critical Issues:');
                results.issues.forEach(issue => console.log(`• ${issue}`));
                console.groupEnd();
            }
            
            if (results.warnings.length > 0) {
                console.group('⚠️ Warnings:');
                results.warnings.forEach(warning => console.log(`• ${warning}`));
                console.groupEnd();
            }
            
            if (results.recommendations.length > 0) {
                console.group('💡 Recommendations:');
                results.recommendations.forEach(rec => console.log(`• ${rec}`));
                console.groupEnd();
            }
            
            console.groupEnd();
            
            return results;
        }
    };

    // Run validation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => seoValidator.generateReport(), 1000);
        });
    } else {
        setTimeout(() => seoValidator.generateReport(), 1000);
    }

    // Expose for manual use
    window.seoValidator = seoValidator;

})();
