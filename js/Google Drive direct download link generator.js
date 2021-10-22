<div class="container">
  <div class="panel panel-default panel-primary" id="mainpanel">
    <div class="panel-heading">
      <h1 class="panel-title">Google Drive direct download link generator</h1>
    </div>
    <div class="panel-body">
      <form>
        <div class="form-group">
          <label for="sharelink">Share link</label>
          <input type="text" class="form-control" id="sharelink" placeholder="https://drive.google.com/file/d/XX-X__XXXXX-XXXXXXXXXXXXXXXX/view?usp=sharing" autofocus="true">
        </div>
        <div class="form-group">
          <label for="downloadlink">Download link</label>
          <div class="input-group">
            <input type="text" class="form-control" id="downloadlink" readonly>
            <span class="input-group-btn">
        <button id="copylinkbtn" class="btn btn-primary" type="button" data-clipboard-target="#downloadlink" disabled>Copy link</button>
      </span>
          </div>
        </div>
      </form>

  <button class="btn btn-default" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
  Show instructions
</button>
  <div class="collapse" id="collapseExample">
   <br />
    <div class="well text-center">
      <img src="https://drive.google.com/uc?export=download&id=0B-B__6JMBt-jb1MxWHY5UE5QUXM" alt="" />
    </div>
  </div>      
      
    </div>
    <div class="panel-footer text-right">&copy; 2016 Thijs Huijssoon</div>
  </div>
</div>
<style>
.postTitle {display:none!important}
#mainpanel {
  margin-top: 70px;
}
img {
  max-width: 100%;
  height: auto;
}
</style>
<script>
(function($) {
  $(function() {
    var $shareLink = $('#sharelink'),
      $downloadLink = $('#downloadlink'),
      $copyButton = $('#copylinkbtn'),
      clipboard;

    $shareLink.on('keyup paste', function() {
      var link = $shareLink.val(),
        l = link.replace(/(.+)\/file\/d\/(.+)\/(.+)/, "http://file.giahuy.net/d/$2/");
      if(l !== link) {
        $downloadLink.val(l);
        $copyButton.removeAttr('disabled');
      } else {
        $downloadLink.val('');
        $copyButton.attr('disabled', 'disabled');
      }
    });

    $downloadLink.on('click', function() {
      $downloadLink.select();
    });

    clipboard = new Clipboard('#copylinkbtn');
    clipboard.on('success', function(e) {
      $.notify({
        icon: 'glyphicon glyphicon-ok-circle',
        title: 'Link copied to clipboard:',
        message: e.text,
        url: e.text,
        target: '_blank'
      }, {
        // settings
        type: "success",
        placement: {
          from: "top",
          align: "center"
        }
      });

      // $.notify(e.text + " copied to clipboard.");

      e.clearSelection();
    });

  });
})(jQuery);
</script>
