package v1

import (
	"github.com/gin-gonic/gin"
	"message-nest/pkg/app"
	"message-nest/pkg/e"
	"message-nest/service/send_message_service"
	"net/http"
)

type SendMessageReq struct {
	TaskID   string `json:"task_id" validate:"required,len=36" label:"任务id"`
	Text     string `json:"text" validate:"required" label:"文本内容"`
	HTML     string `json:"html"  label:"html内容"`
	MarkDown string `json:"markdown" label:"markdown内容"`
}

// DoSendMassage 外部调用发信接口
func DoSendMassage(c *gin.Context) {
	var (
		appG = app.Gin{C: c}
		req  SendMessageReq
	)

	errCode, errMsg := app.BindJsonAndPlayValid(c, &req)
	if errCode != e.SUCCESS {
		appG.CResponse(errCode, errMsg, nil)
		return
	}

	msgService := send_message_service.SendMessageService{
		TaskID:   req.TaskID,
		Text:     req.Text,
		HTML:     req.HTML,
		MarkDown: req.MarkDown,
	}
	err := msgService.Send()
	if err != "" {
		appG.CResponse(http.StatusBadRequest, "发送失败！", nil)
		return
	}

	appG.CResponse(http.StatusOK, "发送成功！", nil)
}