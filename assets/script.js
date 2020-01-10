const findGetParameter = (parameterName)=>{
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

const hideLoader = ()=> {
    $(".progress").hide();
}

// Sets the content of the app
const initializeApp = (data) => {
    if(findGetParameter('id') !== null){
        let id = findGetParameter('id');
        let codelab = data.codelabs.filter(obj => { return obj.id == id });
        
        if(codelab !== []){

            let data = codelab[0];

            if (data['title']) {
                $("#codelabsTitle").html(data.title).fadeIn('500');
            }

            if (data['sections']) {
                let count = 0;
                data.sections.forEach(section => {
                    count++;
                    var tpl;
                    if(count == 1 && findGetParameter('section') == null){

                        tpl = `
                        <div class="card-menu active" onclick="window.location.replace('/?id=${id}&section=${section.id}')">
                            <div class="number"><p><i class="material-icons">play_arrow</i></p></div> 
                            <p>${section.title || 'Untitled Section'}</p>
                        </div>`;     
                    } else {
                        if(section.id !== findGetParameter('section')){
                            tpl = `
                            <div class="card-menu" onclick="window.location.replace('/?id=${id}&section=${section.id}')">
                                <div class="number"><p>${count}</p></div> 
                                <p>${section.title || 'Untitled Section'}</p>
                            </div>`;
                        } else {
                            tpl = `
                            <div class="card-menu active" onclick="window.location.replace('/?id=${id}&section=${section.id}')">
                                <div class="number"><p><i class="material-icons">play_arrow</i></p></div> 
                                <p>${section.title || 'Untitled Section'}</p>
                            </div>`;
                        }

                    }
                    
                    $(".menuContainer").append(tpl);
                });
            }

            if(findGetParameter('section') == null){
                if(data.sections[0]) {
                    fetch(`${ data.sections[0].filename }`).then(res => {
                        return res.text();
                    }).then(res => {
                        $("#sectionContent").html(res);
                        $(".sectionCard").fadeIn(500);
                        hideLoader();
                    }).catch(e => {
                        console.error(e);
                    })
                }
            } else {
                let s = findGetParameter('section');
                let r = data.sections.filter(obj=>{ return obj.id == s});
                fetch(`${ r[0].filename }`).then(res => {
                    return res.text();
                }).then(res => {
                    $("#sectionContent").html(res);
                    $(".sectionCard").fadeIn(500);
                    hideLoader();
                }).catch(e => {
                    console.error(e);
                })
            }

        } else {
            window.location.replace('/list');
        }

    }
};

$(document).ready(()=>{
    initializeApp(data);
});

// Opens the side menu
$("#menuButton").click(()=>{
    $(".menu").fadeIn();
});

// Closes the side menu
$("#closeMenuButton").click(()=>{
    $(".menu").fadeOut();
});
