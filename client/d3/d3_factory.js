angular.module('d3', [])
  .factory('d3Factory', ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
      let d = $q.defer();


      onScriptLoad = () => {
        console.log(d);
        $rootScope.$apply(function() { d.resolve(window.d3); });
      }

      //Create a script tag with D3
      //call onScriptLoad when it is loaded.
      //This will only load D3 when and where we need it
      //and since this is a factory.
      let scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript'; 
      scriptTag.async = true;
      scriptTag.src = 'http://d3js.org/d3.js';
      scriptTag.onreadystatechange = () => {
        if (this.readyState == 'complete') onScriptLoad();
      }
      scriptTag.onload = onScriptLoad;
 
      let s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);



 
      return {
        d3: function() { return d.promise; }
      };
  }]);