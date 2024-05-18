// slider.js

document.getElementById('propertyValueSlider').addEventListener('input', function() {
    var value = this.value;
    var max = this.max;
    var progress = (value / max) * 100;
    document.getElementById('sliderProgress').style.width = progress + '%';
    document.getElementById('propertyValueDisplay').innerText = Number(value).toLocaleString('en', {useGrouping:true});
    document.getElementById('propertyValue').value = value;
});
