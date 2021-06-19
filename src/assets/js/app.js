(function ($) {

    function createCounterElement(counter) {
        const template = $($("#counter-template").html());
        template.attr('data-id', counter.id);
        template.find(".counter-name").html(counter.name);
        template.find(".counter-count").html(counter.count);
        template.find('.counter-increment').click((e) => incrementCounter(counter.id));
        template.find('.counter-decrement').click((e) => decrementCounter(counter.id));
        template.find('.counter-delete').click((e) => deleteCounter(counter.id));
        $("#counter-list").append(template);
    }

    function getCounters() {
        if (localStorage) {
            const countersString = localStorage.getItem("counters");

            if (countersString && countersString.length) {
                return JSON.parse(countersString);
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    function getCounter(id, counters) {
        const filtered = counters.filter((v, i) => v.id === id);
        if (filtered.length === 1) {
            return filtered[0];
        }
    }

    function setCounters(counters) {
        if (localStorage) {
            localStorage.setItem("counters", JSON.stringify(counters));
        }
    }

    function addCounter(counterName) {
        const counters = getCounters();
        const counter = {
            id: Date.now(),
            name: counterName,
            count: 0,
            history: [{
                count: 0,
                date: Date.now()
            }]
        };
        counters.push(counter);
        setCounters(counters);

        createCounterElement(counter);
    }

    function deleteCounter(id) {
        let counters = getCounters();
        if (confirm('Are you sure you want to delete this counter?')) {
            counters = counters.filter((v, i) => v.id !== id);
            setCounters(counters);
            $(`.card[data-id="${id}"`).remove();
        }
    }

    function incrementCounterBase(id, count) {
        const counters = getCounters();
        const counter = getCounter(id, counters);
        counter.count += count;
        counter.history.push({
            date: Date.now(),
            count: counter.count
        });
        
        setCounters(counters);
        
        $(`.card[data-id="${id}"`).find('.counter-count').html(counter.count);
    }

    function incrementCounter(id) {
        incrementCounterBase(id, 1);
    }

    function decrementCounter(id) {
        incrementCounterBase(id, -1);

    }

    function bindAddCounter() {
        $('#add-counter-form').submit(function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.checkValidity()) {
                const counterName = $('#counter-name').val();
                addCounter(counterName);

                $('#counter-name').val('');
            } else {
                this.classList.add('was-validated');
            }

            return false;
        });
    }

    function loadCounters() {
        const counters = getCounters();
        $("#counter-list").empty();

        for (let i = 0; i < counters.length; i++) {
            let counter = counters[i];
            createCounterElement(counter);
        }
    }

    $(function () {
        bindAddCounter();

        loadCounters();
    });

    jQuery(document).on('click', '.navbar-nav > .dropdown', function(e) {
        e.stopPropagation();
    });

    $(".dropdown-submenu").click(function() {
        $(".dropdown-submenu > .dropdown-menu").toggleClass("show");
    });

})($);