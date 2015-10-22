using DotWeb.Api;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System.Threading.Tasks;
using System.Web.Http.Results;

namespace VideoPlatform.Tests.Controllers
{
    [TestClass]
    public class ActiveMainControllerTest
    {
        [TestMethod]
        public async Task Put()
        {
            MberDataDetailController controller = new MberDataDetailController();
            


            var getApi = await controller.Post(new Member_Detail()) as OkNegotiatedContentResult<ResultInfo>;
            Assert.IsNotNull(getApi);
        }
    }

    [TestClass]
    public class LogicControllerTest
    {
        [TestMethod]
        public async Task exitsHolder()
        {
            MberDataDetailController controller = new MberDataDetailController();
            var getApi = await controller.Post(new Member_Detail()) as OkNegotiatedContentResult<ResultInfo>;
            Assert.IsNotNull(getApi);
        }
    }


}
