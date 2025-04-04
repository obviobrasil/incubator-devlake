/*
Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package tasks

import (
	"log"

	"github.com/apache/incubator-devlake/core/errors"
	"github.com/apache/incubator-devlake/core/plugin"
	"github.com/apache/incubator-devlake/helpers/pluginhelper/api"
	"github.com/apache/incubator-devlake/plugins/argo/models"
)

var _ plugin.SubTaskEntryPoint = ConvertDeployments

var ConvertDeploymentsMeta = plugin.SubTaskMeta{
	Name:             "convert_deployments",
	EntryPoint:       ConvertDeployments,
	EnabledByDefault: true,
	Description:      "Converte deployments do DevLake para análise de métricas DORA",
	DomainTypes:      []string{plugin.DOMAIN_TYPE_CICD},
}

// converte o _tools para o modelo de dominio (pacote devops)
//
//	"github.com/apache/incubator-devlake/core/models/domainlayer/devops"
func ConvertDeployments(taskCtx plugin.SubTaskContext) errors.Error {
	log.Println("[ARGO] Iniciando plugin de convert.")

	// TODO
	converter, err := api.NewStatefulDataConverter(&api.StatefulDataConverterArgs[models.Deployment]{
		SubtaskCommonArgs: &api.SubtaskCommonArgs{
			Params: taskCtx.GetData(),
			Table:  RAW_DEPLOYMENT_TABLE,
		},
		Input:   nil,
		Convert: nil,
	})

	if err != nil {
		return err
	}

	log.Println("[ARGO] Conversão de deployments concluída com sucesso!")
	return converter.Execute()
}
